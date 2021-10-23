const router = require('express').Router();
const db = require('../../models');

// GET ALL
router.get('/', async (req, res) => {
	try {
		const workoutsData = await db.Workout.aggregate([
			{
				$addFields: {
					totalDuration: {
						$sum: '$exercises.duration'
					}
				}
			}
		]);

		res.status(200).json(workoutsData);

	} catch (err) {
		res.status(400).json(err);
	}
});

// PUSH
router.put('/:id', async (req, res) => {
	try {
		const workoutData = await db.Workout.updateOne(
			{
				_id: req.params.id
			},
			{
				$push: {
					exercises: { ...req.body }
				}
			}
		);

		res.status(200).json(workoutData);

	} catch (err) {
		res.status(400).json(err);
	}
});

// CREATE
router.post('/', async (req, res) => {
	try {
		const workoutData = await db.Workout.create(req.body);

		res.status(200).json(workoutData);

	} catch (err) {
		res.status(400).json(err);
	}
});

// GATHER LAST 7
router.get('/range', async (req, res) => {
	try {
		const workoutData = await db.Workout.aggregate([
			{
				$sort: {
					day: -1
				}
			},
			{
				$limit: 7
			},
			{
				$addFields: {
					totalDuration: {
						$sum: '$exercises.duration'
					}
				}
			}
		]);

		res.status(200).json(workoutData);

	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = router;