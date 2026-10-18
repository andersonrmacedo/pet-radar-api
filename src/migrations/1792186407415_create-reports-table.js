exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  })

  pgm.createTable('reports', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    type: { type: 'varchar(10)', notNull: true },
    species: { type: 'varchar(20)', notNull: true },
    size: { type: 'varchar(10)', notNull: true },
    color: { type: 'varchar(100)', notNull: true },
    description: { type: 'text' },
    photo_url: { type: 'text' },
    name: { type: 'varchar(255)' },
    status: { type: 'varchar(20)', notNull: true, default: 'active' },
    latitude: { type: 'decimal(10,7)', notNull: true },
    longitude: { type: 'decimal(10,7)', notNull: true },
    contact_name: { type: 'varchar(255)', notNull: true },
    contact_phone: { type: 'varchar(50)', notNull: true },
    contact_email: { type: 'varchar(255)' },
    occurred_at: { type: 'timestamp', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    user_id: { type: 'uuid', references: '"users"' },
  })

  pgm.createIndex('reports', 'status')
  pgm.createIndex('reports', 'type')
}

exports.down = (pgm) => {
  pgm.dropTable('reports')
  pgm.dropTable('users')
}