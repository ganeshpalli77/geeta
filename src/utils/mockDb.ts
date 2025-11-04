// Mock MongoDB implementation using localStorage
// This mimics MongoDB operations and can be replaced with real backend calls

export interface DbDocument {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface QueryFilter {
  [key: string]: any;
}

export interface UpdateOperation {
  $set?: { [key: string]: any };
  $push?: { [key: string]: any };
  $pull?: { [key: string]: any };
  $inc?: { [key: string]: number };
}

class MockDatabase {
  private dbName = 'geetaOlympiadDB';

  // Initialize database with collections
  private initCollection(collectionName: string) {
    const key = `${this.dbName}_${collectionName}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  }

  // Get all documents from a collection
  private getCollection(collectionName: string): DbDocument[] {
    this.initCollection(collectionName);
    const key = `${this.dbName}_${collectionName}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // Save collection to localStorage
  private saveCollection(collectionName: string, data: DbDocument[]) {
    const key = `${this.dbName}_${collectionName}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Generate unique ID (mimics MongoDB ObjectId)
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Match document against query filter
  private matchesFilter(doc: DbDocument, filter: QueryFilter): boolean {
    return Object.entries(filter).every(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Handle operators like $gt, $lt, $in, etc.
        if (value.$in) {
          return value.$in.includes(doc[key]);
        }
        if (value.$gt !== undefined) {
          return doc[key] > value.$gt;
        }
        if (value.$lt !== undefined) {
          return doc[key] < value.$lt;
        }
        if (value.$gte !== undefined) {
          return doc[key] >= value.$gte;
        }
        if (value.$lte !== undefined) {
          return doc[key] <= value.$lte;
        }
        if (value.$ne !== undefined) {
          return doc[key] !== value.$ne;
        }
        return JSON.stringify(doc[key]) === JSON.stringify(value);
      }
      return doc[key] === value;
    });
  }

  // FIND: Get documents matching filter
  find(collectionName: string, filter: QueryFilter = {}): DbDocument[] {
    const collection = this.getCollection(collectionName);
    if (Object.keys(filter).length === 0) {
      return collection;
    }
    return collection.filter(doc => this.matchesFilter(doc, filter));
  }

  // FIND ONE: Get first document matching filter
  findOne(collectionName: string, filter: QueryFilter): DbDocument | null {
    const results = this.find(collectionName, filter);
    return results.length > 0 ? results[0] : null;
  }

  // FIND BY ID: Get document by _id
  findById(collectionName: string, id: string): DbDocument | null {
    return this.findOne(collectionName, { _id: id });
  }

  // INSERT ONE: Add new document
  insertOne(collectionName: string, document: Omit<DbDocument, '_id'>): DbDocument {
    const collection = this.getCollection(collectionName);
    const newDoc: DbDocument = {
      ...document,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    collection.push(newDoc);
    this.saveCollection(collectionName, collection);
    return newDoc;
  }

  // INSERT MANY: Add multiple documents
  insertMany(collectionName: string, documents: Omit<DbDocument, '_id'>[]): DbDocument[] {
    const collection = this.getCollection(collectionName);
    const newDocs = documents.map(doc => ({
      ...doc,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    collection.push(...newDocs);
    this.saveCollection(collectionName, collection);
    return newDocs;
  }

  // UPDATE ONE: Update first matching document
  updateOne(
    collectionName: string,
    filter: QueryFilter,
    update: UpdateOperation | Partial<DbDocument>
  ): boolean {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex(doc => this.matchesFilter(doc, filter));
    
    if (index === -1) return false;

    // Handle MongoDB update operators
    if (update.$set) {
      Object.assign(collection[index], update.$set);
    } else if (update.$push) {
      Object.entries(update.$push).forEach(([key, value]) => {
        if (Array.isArray(collection[index][key])) {
          collection[index][key].push(value);
        } else {
          collection[index][key] = [value];
        }
      });
    } else if (update.$pull) {
      Object.entries(update.$pull).forEach(([key, value]) => {
        if (Array.isArray(collection[index][key])) {
          collection[index][key] = collection[index][key].filter(
            (item: any) => item !== value
          );
        }
      });
    } else if (update.$inc) {
      Object.entries(update.$inc).forEach(([key, value]) => {
        collection[index][key] = (collection[index][key] || 0) + value;
      });
    } else {
      // Direct update
      Object.assign(collection[index], update);
    }

    collection[index].updatedAt = new Date().toISOString();
    this.saveCollection(collectionName, collection);
    return true;
  }

  // UPDATE BY ID: Update document by _id
  updateById(
    collectionName: string,
    id: string,
    update: UpdateOperation | Partial<DbDocument>
  ): boolean {
    return this.updateOne(collectionName, { _id: id }, update);
  }

  // UPDATE MANY: Update all matching documents
  updateMany(
    collectionName: string,
    filter: QueryFilter,
    update: UpdateOperation | Partial<DbDocument>
  ): number {
    const collection = this.getCollection(collectionName);
    let count = 0;

    collection.forEach((doc, index) => {
      if (this.matchesFilter(doc, filter)) {
        if (update.$set) {
          Object.assign(collection[index], update.$set);
        } else {
          Object.assign(collection[index], update);
        }
        collection[index].updatedAt = new Date().toISOString();
        count++;
      }
    });

    if (count > 0) {
      this.saveCollection(collectionName, collection);
    }
    return count;
  }

  // DELETE ONE: Delete first matching document
  deleteOne(collectionName: string, filter: QueryFilter): boolean {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex(doc => this.matchesFilter(doc, filter));
    
    if (index === -1) return false;

    collection.splice(index, 1);
    this.saveCollection(collectionName, collection);
    return true;
  }

  // DELETE BY ID: Delete document by _id
  deleteById(collectionName: string, id: string): boolean {
    return this.deleteOne(collectionName, { _id: id });
  }

  // DELETE MANY: Delete all matching documents
  deleteMany(collectionName: string, filter: QueryFilter): number {
    const collection = this.getCollection(collectionName);
    const filtered = collection.filter(doc => !this.matchesFilter(doc, filter));
    const deletedCount = collection.length - filtered.length;
    
    if (deletedCount > 0) {
      this.saveCollection(collectionName, filtered);
    }
    return deletedCount;
  }

  // COUNT: Count documents matching filter
  count(collectionName: string, filter: QueryFilter = {}): number {
    return this.find(collectionName, filter).length;
  }

  // CLEAR COLLECTION: Remove all documents
  clearCollection(collectionName: string) {
    this.saveCollection(collectionName, []);
  }

  // DROP DATABASE: Clear all data
  dropDatabase() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.dbName)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Singleton instance
export const mockDb = new MockDatabase();
