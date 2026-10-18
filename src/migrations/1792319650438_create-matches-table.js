exports.up = (pgm) => {
  pgm.createTable('matches', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    lost_report_id: {
      type: 'uuid',
      notNull: true,
      references: '"reports"',
      onDelete: 'CASCADE',
    },
    found_report_id: {
      type: 'uuid',
      notNull: true,
      references: '"reports"',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  })

  pgm.addConstraint('matches', 'unique_match', 'UNIQUE (lost_report_id, found_report_id)')
}

exports.down = (pgm) => {
  pgm.dropTable('matches')
}