module.exports = function(app, connection){
  app.get('/flashcards', function(req, res){
  connection.query('select * from flashcards', function(err, rows){
    if(err){
      console.log("Error reading flash cards");
      return res.sendStatus(500);
    }
    res.json(rows);
  });
  });
  
  app.post('/flashcards', function(req, res){
  var query = `insert INTO flashcards (front_text, back_text, owner, subject)
        VALUES('${req.body.front_text}', '${req.body.back_text}', '${req.body.owner}', '${req.body.subject}')`;
console.log(query);
  connection.query(query, function(err, result){
    if(err){
      console.log("Error reading flash cards: "+err.toString());
      return res.sendStatus(500);
    }
  res.json(result);
  });
});
}
