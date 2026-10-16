exports.up = (pgm) => {
  pgm.sql(`
    CREATE TYPE report_type AS ENUM ('lost', 'found');
    CREATE TYPE animal_species AS ENUM ('dog', 'cat', 'other');
    CREATE TYPE animal_size AS ENUM ('small', 'medium', 'large');
    CREATE TYPE report_status AS ENUM ('active', 'resolved');

    CREATE TABLE reports (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type        report_type      NOT NULL,
      species     animal_species   NOT NULL,
      size        animal_size      NOT NULL,
      color       VARCHAR(100)     NOT NULL,
      description TEXT,
      photo_url   VARCHAR(500),
      name        VARCHAR(100),
      location    GEOGRAPHY(Point, 4326) NOT NULL,
      status      report_status    NOT NULL DEFAULT 'active',
      contact_name  VARCHAR(200)   NOT NULL,
      contact_phone VARCHAR(50)    NOT NULL,
      contact_email VARCHAR(200),
      occurred_at   TIMESTAMP      NOT NULL,
      created_at    TIMESTAMP      NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMP      NOT NULL DEFAULT NOW()
    );

    CREATE INDEX reports_location_idx ON reports USING GIST (location);
    CREATE INDEX reports_status_idx   ON reports (status);
    CREATE INDEX reports_type_idx     ON reports (type);
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS reports;
    DROP TYPE IF EXISTS report_status;
    DROP TYPE IF EXISTS animal_size;
    DROP TYPE IF EXISTS animal_species;
    DROP TYPE IF EXISTS report_type;
  `)
}