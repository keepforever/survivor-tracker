CREATE TABLE "survivor_cast_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"season_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer,
	"occupation" varchar(150),
	"hometown" varchar(100),
	"tribe" varchar(50),
	"is_still_in_game" boolean DEFAULT true,
	"placement_order" integer,
	"voted_off_day" integer,
	"voted_off_date" date,
	"elimination_reason" varchar(50),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "survivor_player" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "survivor_pool_pick" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"cast_member_id" integer NOT NULL,
	"season_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "survivor_season" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"season_number" integer NOT NULL,
	"location" varchar(100),
	"start_date" date,
	"end_date" date,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "survivor_cast_member" ADD CONSTRAINT "survivor_cast_member_season_id_survivor_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."survivor_season"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survivor_pool_pick" ADD CONSTRAINT "survivor_pool_pick_player_id_survivor_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."survivor_player"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survivor_pool_pick" ADD CONSTRAINT "survivor_pool_pick_cast_member_id_survivor_cast_member_id_fk" FOREIGN KEY ("cast_member_id") REFERENCES "public"."survivor_cast_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survivor_pool_pick" ADD CONSTRAINT "survivor_pool_pick_season_id_survivor_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."survivor_season"("id") ON DELETE cascade ON UPDATE no action;