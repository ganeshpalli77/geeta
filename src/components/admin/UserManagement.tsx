import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Users, Search, Mail, Phone, User, Calendar } from 'lucide-react';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const usersData = localStorage.getItem('geetaOlympiadUsers');
  const users = usersData ? JSON.parse(usersData) : [];

  const filteredUsers = users.filter((user: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm) ||
      user.profiles.some((p: any) => 
        p.name.toLowerCase().includes(searchLower) ||
        p.prn.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl text-[#193C77] flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </h2>
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by email, phone, name, or PRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>{searchTerm ? 'No users found' : 'No users registered yet'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user: any) => (
              <Card key={user.id} className="p-4 bg-[#FFF8ED]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {user.email && (
                        <div className="flex items-center gap-1 text-sm text-[#193C77]">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1 text-sm text-[#193C77]">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      {user.profiles.length} profile(s)
                    </div>

                    {user.profiles.length > 0 && (
                      <div className="space-y-2 pl-4 border-l-2 border-[#E8C56E]">
                        {user.profiles.map((profile: any) => (
                          <div key={profile.id} className="p-3 bg-white rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="w-4 h-4 text-[#D55328]" />
                                  <span className="text-[#822A12] font-semibold">
                                    {profile.name}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>PRN: {profile.prn}</div>
                                  <div>DOB: {profile.dob}</div>
                                  <div>Language: {profile.preferredLanguage}</div>
                                  {profile.category && (
                                    <div>Category: {profile.category}</div>
                                  )}
                                  {profile.createdAt && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                      <Calendar className="w-3 h-3" />
                                      Created: {new Date(profile.createdAt).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-900">
            <strong>Total:</strong> {filteredUsers.length} user(s) found
          </div>
        </div>
      </Card>
    </div>
  );
}
