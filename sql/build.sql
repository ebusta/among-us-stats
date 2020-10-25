CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS game CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS map CASCADE;
DROP TABLE IF EXISTS murder CASCADE;
DROP TABLE IF EXISTS player_game CASCADE;

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
	player_name VARCHAR(255) NOT NULL,
  group_id uuid NOT NULL,
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

CREATE TABLE group (
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
)

ALTER TABLE game ADD CONSTRAINT fk_map FOREIGN KEY(map_id) REFERENCES map(map_id);
ALTER TABLE game ADD CONSTRAINT fk_group FOREIGN KEY(group_id) REFERENCES group(group_id);
ALTER TABLE player ADD CONSTRAINT fk_group FOREIGN KEY(group_id) REFERENCES group(group_id);
ALTER TABLE murder ADD CONSTRAINT fk_player FOREIGN KEY(player_id) REFERENCES player(player_id);
ALTER TABLE murder ADD CONSTRAINT fk_game FOREIGN KEY(game_id) REFERENCES game(game_id);
ALTER TABLE murder ADD CONSTRAINT fk_victim FOREIGN KEY(victim_id) REFERENCES player(player_id);
ALTER TABLE player_game ADD CONSTRAINT fk_player FOREIGN KEY(player_id) REFERENCES player(player_id);
ALTER TABLE player_game ADD CONSTRAINT fk_game FOREIGN KEY(game_id) REFERENCES game(game_id);
ALTER TABLE player_group ADD CONSTRAINT fk_player FOREIGN KEY(player_id) REFERENCES player(player_id);
ALTER TABLE player_group ADD CONSTRAINT fk_group FOREIGN KEY(group_id) REFERENCES group(group_id);

INSERT INTO map (map_name) VALUES ('The Skeld'); //1
INSERT INTO map (map_name) VALUES ('MIRA HQ'); //2
INSERT INTO map (map_name) VALUES ('Polus'); //3
