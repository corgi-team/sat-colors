const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/problem', function(req, res){
  // fs.writeFileSync('solver/graph.json', JSON.stringify(req.body));

  const child = exec('cd solver && python mapcolor.py graph.json', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    // console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    const solution = JSON.parse(fs.readFileSync('solver/solution.json', 'utf8'));

    res.send(solution);
  });


});


var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
