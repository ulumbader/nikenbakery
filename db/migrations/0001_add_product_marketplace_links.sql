ALTER TABLE `products` ADD `shopee_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `shopee_enabled` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `tokopedia_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `tokopedia_enabled` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `tiktok_shop_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `tiktok_shop_enabled` integer DEFAULT false NOT NULL;