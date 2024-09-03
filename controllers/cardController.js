exports.playCard = (req, res) => {
  const { cardId } = req.body;

  res.json({
    status: 'Success',
    message: 'Card played successfully!'
  });
};