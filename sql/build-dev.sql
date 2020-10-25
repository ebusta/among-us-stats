CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS game CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS map CASCADE;
DROP TABLE IF EXISTS murder CASCADE;
DROP TABLE IF EXISTS player_game CASCADE;
DROP TABLE IF EXISTS group_ CASCADE;
DROP TABLE IF EXISTS player_group CASCADE;

-- DROP FUNCTION IF EXISTS create_game_get_id CASCADE;

CREATE TABLE game (
	game_id uuid DEFAULT uuid_generate_v4 (),
	game_date TIMESTAMP NOT NULL,
	map_id uuid NOT NULL,
	who_won VARCHAR(10) CHECK (who_won in ('crew', 'imp')) NOT NULL,
	how_victory_achieved VARCHAR(10) CHECK (how_victory_achieved in ('murder', 'emergency', 'deception', 'tasks', 'ejection')) NOT NULL,
  group_id uuid NOT NULL,
	PRIMARY KEY(game_id)
);

CREATE TABLE player (
	player_id uuid DEFAULT uuid_generate_v4 (),
	player_name VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY(player_id)
);

CREATE TABLE map (
	map_id uuid DEFAULT uuid_generate_v4 (),
	map_name VARCHAR(255) NOT NULL,
	PRIMARY KEY(map_id)
);

CREATE TABLE murder (
	murder_id uuid DEFAULT uuid_generate_v4 (),
	player_id uuid NOT NULL,
	game_id uuid NOT NULL,
	victim_id uuid NOT NULL,
	PRIMARY KEY(murder_id)
);

CREATE TABLE player_game (
	player_game_id uuid DEFAULT uuid_generate_v4 (),
	player_id uuid NOT NULL,
	game_id uuid NOT NULL,
	player_type VARCHAR (10) CHECK (player_type in ('crew', 'imp')) NOT NULL,
	death_type VARCHAR (10) CHECK (death_type in ('ejection', 'murder', 'emergency')),
	is_victorious BOOLEAN NOT NULL,
	PRIMARY KEY(player_game_id)
);

CREATE TABLE group_ (
  group_id uuid DEFAULT uuid_generate_v4 (),
  group_name VARCHAR (255) NOT NULL,
  pword VARCHAR (255) NOT NULL,
  PRIMARY KEY (group_id)
);

CREATE TABLE player_group (
  player_group_id uuid DEFAULT uuid_generate_v4 (),
  player_id uuid NOT NULL,
  group_id uuid NOT NULL,
  PRIMARY KEY (player_group_id)
);

ALTER TABLE game ADD CONSTRAINT fk_map FOREIGN KEY(map_id) REFERENCES map(map_id);
ALTER TABLE game ADD CONSTRAINT fk_group FOREIGN KEY(group_id) REFERENCES group_(group_id);
ALTER TABLE murder ADD CONSTRAINT fk_player FOREIGN KEY(player_id) REFERENCES player(player_id);
ALTER TABLE murder ADD CONSTRAINT fk_game FOREIGN KEY(game_id) REFERENCES game(game_id);
ALTER TABLE murder ADD CONSTRAINT fk_victim FOREIGN KEY(victim_id) REFERENCES player(player_id);
ALTER TABLE player_game ADD CONSTRAINT fk_player FOREIGN KEY(player_id) REFERENCES player(player_id);
ALTER TABLE player_game ADD CONSTRAINT fk_game FOREIGN KEY(game_id) REFERENCES game(game_id);
ALTER TABLE player_group ADD CONSTRAINT fk_player FOREIGN KEY(player_id) REFERENCES player(player_id);
ALTER TABLE player_group ADD CONSTRAINT fk_group FOREIGN KEY(group_id) REFERENCES group_(group_id);

INSERT INTO map (map_id, map_name) VALUES ('314e1a2b-42f2-4e26-8f2b-a959d03fadd0', 'The Skeld'); 
INSERT INTO map (map_id, map_name) VALUES ('a5f33526-b126-4554-9fba-e8b9b466f745', 'MIRA HQ'); 
INSERT INTO map (map_id, map_name) VALUES ('b4370a0a-b0b4-46c5-969e-6c4bf2fba3e7', 'Polus');

INSERT INTO group_ (group_id, group_name, pword) VALUES ('a78128f7-c143-49bb-b2f1-2a5064a1f448', 'test_group', 'password');

-- INSERT INTO player (player_name) VALUES ('Test1');
INSERT INTO player (player_id, player_name) VALUES ('fc1ed42d-7d40-4a4f-8aa1-b8e6861f20a8', 'Test1');
INSERT INTO player (player_id, player_name) VALUES ('3e0e41aa-a6f1-4f48-b0cf-06bb768d1c6d', 'Test2');
INSERT INTO player (player_id, player_name) VALUES ('2c9bf650-7b1f-4b09-a08f-f0e96f4ad7bc', 'Test3');


INSERT INTO player_group (player_id, group_id) VALUES ('fc1ed42d-7d40-4a4f-8aa1-b8e6861f20a8', 'a78128f7-c143-49bb-b2f1-2a5064a1f448');
INSERT INTO player_group (player_id, group_id) VALUES ('3e0e41aa-a6f1-4f48-b0cf-06bb768d1c6d', 'a78128f7-c143-49bb-b2f1-2a5064a1f448');
INSERT INTO player_group (player_id, group_id) VALUES ('2c9bf650-7b1f-4b09-a08f-f0e96f4ad7bc', 'a78128f7-c143-49bb-b2f1-2a5064a1f448');