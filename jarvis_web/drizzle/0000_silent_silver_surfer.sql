CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`timestamp` integer DEFAULT (strftime('%s', CURRENT_TIMESTAMP)) NOT NULL
);
