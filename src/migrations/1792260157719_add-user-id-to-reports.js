exports.up = (pgm) => {
  pgm.addColumn('reports', {
    user_id: {
      type: 'uuid',
      references: '"users"',
      onDelete: 'SET NULL',
    },
  })
}

exports.down = (pgm) => {
  pgm.dropColumn('reports', 'user_id')
}