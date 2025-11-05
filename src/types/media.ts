/**
 * Type definitions for the Media Browser application
 * 
 * Backend Reference: These types correspond to the MySQL schema
 * See database schema at the bottom of this file
 */

export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: number;
  filename: string;
  path: string;
  type: MediaType;
  size: number;
  created_at: string;
  modified_at: string;
  tags: string[];
  category?: string; // Indian language category (Hindi, Tamil, Telugu, etc.)
  public_url: string;
  thumbnail_url: string;
  // Optional metadata
  width?: number;
  height?: number;
  duration?: number; // for videos, in seconds
  mime_type?: string;
}

export interface MediaFilters {
  search: string;
  type: MediaType | 'all';
  category: string; // Language category filter
  dateFrom: string;
  dateTo: string;
  sizeMin: number;
  sizeMax: number;
  tags: string[];
  sortBy: 'filename' | 'modified_at' | 'size' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface MediaApiResponse {
  success: boolean;
  data: MediaItem[];
  meta: PaginationMeta;
  message?: string;
}

/**
 * MySQL Database Schema (for backend implementation)
 * 
 * CREATE TABLE `media` (
 *   `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   `filename` VARCHAR(255) NOT NULL,
 *   `path` VARCHAR(512) NOT NULL,
 *   `type` ENUM('image', 'video') NOT NULL,
 *   `size` BIGINT UNSIGNED NOT NULL COMMENT 'File size in bytes',
 *   `width` INT UNSIGNED NULL,
 *   `height` INT UNSIGNED NULL,
 *   `duration` INT UNSIGNED NULL COMMENT 'Video duration in seconds',
 *   `mime_type` VARCHAR(100) NOT NULL,
 *   `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   `modified_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   `public_url` VARCHAR(512) NOT NULL,
 *   `thumbnail_url` VARCHAR(512) NULL,
 *   `category` VARCHAR(50) DEFAULT NULL COMMENT 'Language category (Hindi, Tamil, etc.)',
 *   INDEX `idx_type` (`type`),
 *   INDEX `idx_modified_at` (`modified_at`),
 *   INDEX `idx_filename` (`filename`),
 *   INDEX `idx_category` (`category`),
 *   FULLTEXT INDEX `ftx_filename` (`filename`)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 * 
 * CREATE TABLE `tags` (
 *   `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   `name` VARCHAR(100) NOT NULL UNIQUE,
 *   `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   INDEX `idx_name` (`name`)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 * 
 * CREATE TABLE `media_tags` (
 *   `media_id` INT UNSIGNED NOT NULL,
 *   `tag_id` INT UNSIGNED NOT NULL,
 *   PRIMARY KEY (`media_id`, `tag_id`),
 *   FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE CASCADE,
 *   FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */
