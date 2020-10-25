const { check, body, validationResult } = require('express-validator');

exports.newStats = [
  check('group_id').not().isEmpty(),
  check('map_id').not().isEmpty(),
  //check('map_id').isIn('1', '2', '3'),
  check('who_won').not().isEmpty(),
  check('who_won').isIn('imp', 'crew'),
  check('how_victory_achieved').not().isEmpty(),
  check('how_victory_achieved').isIn('murder', 'emergency', 'deception', 'tasks', 'ejection'),
  check('players.*.player_id').not().isEmpty(),
  check('players.*.player_type').not().isEmpty(),
  //check('players.*.player_type').isIn('imp', 'crew'),
  //check('players.*.death_type').isIn('null', 'ejection', 'murder', 'emergency'),
  check('players.*.is_victorious').not().isEmpty(),
  check('players.*.is_victorious').isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else next();
  },
];
