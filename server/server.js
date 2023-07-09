const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const path = require("path");
var http = require('http');

var options = {
  host: 'neorecipes.onrender.com',
};
function request() {
  http.get(options, function(res){
    res.on('data', function(chunk){
       console.log(chunk);
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });
}
setInterval(request, 60000*10);


// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dgyqsj1tn",
  api_key: "276287283766769",
  api_secret: "RTRpuJqiMTv3WhV-dwIbbYYimhs",
});

// Getting date
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

var dateObj = new Date();
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var month = monthNames[dateObj.getMonth()];

var currDate = year + "/" + month + "/" + day;

// Database Configuration
const db = mysql.createPool({
  host: "eu-cdbr-west-03.cleardb.net",
  user: "bf7d7ad2cdb88e",
  password: "9e1cde73",
  database: "heroku_ff065fdc01ec6ea",
  multipleStatements: true,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("image"), async (req, res) => {
  const id = req.body.id;
  let desc = req.body.description;

  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);
  await cloudinary.uploader.upload(file64.content, {
    public_id: path.parse(req.file.originalname).name,
    format: "WebP",
  });

  const url = cloudinary.url(path.parse(req.file.originalname).name);

  desc = desc.replace(/'/g, "\\'");
  desc = desc.replace(/"/g, '\\"');

  const sqlUpdate = `update user set profileImage="${url}", description="${desc}" where id = "${id}"`;
  db.query(sqlUpdate, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/add-recipe", upload.single("recipeimage"), async (req, res) => {
  const creatorId = req.body.creatorId;
  const recipeId = req.body.recipeId;
  const ingredientsId = req.body.ingredientsId;
  const stepId = req.body.stepId;
  const tagId = req.body.tagId;
  let title = req.body.title;
  const creatorName = req.body.creatorName;
  const category = req.body.category;
  const preparationTime = req.body.preparationTime;
  const difficultyPreparation = req.body.difficultyPreparation;
  const steps = JSON.parse(req.body.steps);
  const ingredients = JSON.parse(req.body.ingredients);
  const tags = JSON.parse(req.body.tags);

  title = title.replace(/'/g, "\\'");
  title = title.replace(/"/g, '\\"');

  const stepsValues = [];
  const ingredientsValues = [];
  const tagsValues = [];

  steps.forEach((step, index) => {
    let stepDesc = step.stepDesc;
    stepDesc = stepDesc.replace(/'/g, "\\'");
    stepDesc = stepDesc.replace(/"/g, '\\"');
    let stepInfo = [index + 1, stepId, stepDesc];
    stepsValues.push(stepInfo);
  });

  ingredients.forEach((ingredient) => {
    let ingredientDesc = ingredient.ingredientDesc;
    ingredientDesc = ingredientDesc.replace(/'/g, "\\'");
    ingredientDesc = ingredientDesc.replace(/"/g, '\\"');
    let ingredientInfo = [ingredientsId, ingredientDesc];
    ingredientsValues.push(ingredientInfo);
  });

  tags.forEach((tag) => {
    let tagText = tag.tag;
    tagText = tagText.replace(/'/g, "\\'");
    tagText = tagText.replace(/"/g, '\\"');
    let tagInfo = [tagId, tagText];
    tagsValues.push(tagInfo);
  });

  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);
  await cloudinary.uploader.upload(file64.content, {
    public_id: path.parse(req.file.originalname).name,
    format: "WebP",
  });

  const url = cloudinary.url(path.parse(req.file.originalname).name);

  const sqlInsert = `insert into Recipe (recipeId, creatorId, ingredientsId, stepId, tagId, recipeCategory, title, mainImage, creatorName, preparationTime, preparationDifficulty, createDate) values('${recipeId}', '${creatorId}', '${ingredientsId}', '${stepId}', '${tagId}', '${category}', '${title}', '${url}', '${creatorName}', ${preparationTime}, '${difficultyPreparation}', '${currDate}'); insert into Ingredients values ?; insert into Steps values ?; insert into Tags values ?`;

  db.query(
    sqlInsert,
    [ingredientsValues, stepsValues, tagsValues],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.post(
  "/api/update-recipe",
  upload.single("updatedimage"),
  async (req, res) => {
    const recipeId = req.body.recipeId;
    const ingredientsId = req.body.ingredientsId;
    const stepId = req.body.stepId;
    const tagId = req.body.tagId;
    let title = req.body.title;
    const category = req.body.category;
    const preparationTime = req.body.preparationTime;
    const difficultyPreparation = req.body.difficultyPreparation;
    const steps = JSON.parse(req.body.steps);
    const ingredients = JSON.parse(req.body.ingredients);
    const tags = JSON.parse(req.body.tags);
    let url = req.body.imageLink;

    title = title.replace(/'/g, "\\'");
    title = title.replace(/"/g, '\\"');

    const stepsValues = [];
    const ingredientsValues = [];
    const tagsValues = [];

    steps.forEach((step, index) => {
      let stepDesc = step.stepDesc;
      stepDesc = stepDesc.replace(/'/g, "\\'");
      stepDesc = stepDesc.replace(/"/g, '\\"');
      let stepInfo = [index + 1, stepId, stepDesc];
      stepsValues.push(stepInfo);
    });

    ingredients.forEach((ingredient) => {
      let ingredientDesc = ingredient.ingredient;
      ingredientDesc = ingredientDesc.replace(/'/g, "\\'");
      ingredientDesc = ingredientDesc.replace(/"/g, '\\"');
      let ingredientInfo = [ingredientsId, ingredientDesc];
      ingredientsValues.push(ingredientInfo);
    });

    tags.forEach((tag) => {
      let tagText = tag.tag;
      tagText = tagText.replace(/'/g, "\\'");
      tagText = tagText.replace(/"/g, '\\"');
      let tagInfo = [tagId, tagText];
      tagsValues.push(tagInfo);
    });

    if (req.file) {
      const extName = path.extname(req.file.originalname).toString();
      const file64 = parser.format(extName, req.file.buffer);
      await cloudinary.uploader.upload(file64.content, {
        public_id: path.parse(req.file.originalname).name,
        format: "WebP",
      });

      url = cloudinary.url(path.parse(req.file.originalname).name);
    }

    const sqlUpdate = `update Recipe set title = '${title}', mainImage='${url}', recipeCategory='${category}', preparationTime='${preparationTime}', preparationDifficulty='${difficultyPreparation}' where recipeId = '${recipeId}'; delete from Steps where stepId = '${stepId}'; delete from Tags where tagId = '${tagId}'; delete from ingredients where ingredientsId = '${ingredientsId}'; insert into Ingredients values ?; insert into Steps values ?; insert into Tags values ?;`;

    db.query(
      sqlUpdate,
      [ingredientsValues, stepsValues, tagsValues],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        res.send(result);
      }
    );
  }
);

app.post(
  "/api/change-image",
  upload.single("changedImage"),
  async (req, res) => {
    const id = req.body.id;

    const extName = path.extname(req.file.originalname).toString();
    const file64 = parser.format(extName, req.file.buffer);
    console.log(file64);
    await cloudinary.uploader.upload(file64.content, {
      public_id: path.parse(req.file.originalname).name,
      format: "WebP",
    });

    const url = cloudinary.url(path.parse(req.file.originalname).name);

    const sqlUpdate = `update User set profileImage="${url}" where id = "${id}";`;
    db.query(sqlUpdate, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    });
  }
);

app.post("/api/register", (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const sqlInsert = `insert into User (id, username, email, password) values ('${id}','${username}','${email}', '${password}');`;
  db.query(sqlInsert, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const sqlSelect = `select * from User where email = '${email}' and password = '${password}';`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/search-recipes", (req, res) => {
  const category = req.body.category;
  const difficultyPreparation = req.body.difficultyPreparation;
  const searchValue = req.body.searchValue;

  const sqlSelect = `select * from Recipe where recipeCategory like '%${category}%' and preparationDifficulty like '%${difficultyPreparation}%' and (MATCH(title) AGAINST('${searchValue}' IN NATURAL LANGUAGE MODE) or title like '%${searchValue}%');`;

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/add-like", (req, res) => {
  const recipeId = req.body.recipeId;
  const userId = req.body.userId;

  const sqlInsert = `insert into Likes values ('${recipeId}','${userId}'); update recipe set likes = likes+1 where recipeId = '${recipeId}';`;

  db.query(sqlInsert, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/remove-like", (req, res) => {
  const recipeId = req.body.recipeId;
  const userId = req.body.userId;

  const sqlDelete = `delete from Likes where recipeId = '${recipeId}' and userId = '${userId}'; update recipe set likes = likes-1 where recipeId = '${recipeId}';`;

  db.query(sqlDelete, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/check-level-incr", (req, res) => {
  const nextLevelRecipesNeed = req.body.nextLevelRecipesNeed;
  const userId = req.body.userId;

  const sqlUpdate = `update User set Level = level + 1 where id = '${userId}' and ${nextLevelRecipesNeed} = (select count(recipeId) from Recipe where creatorId = '${userId}')`;

  db.query(sqlUpdate, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/check-level-decr", (req, res) => {
  const userLevel = req.body.userLevel;
  const userId = req.body.userId;

  const sqlUpdate = `update User set level = level - 1 where id = '${userId}' and ${userLevel} > (select count(recipeId) from Recipe where creatorId = '${userId}')`;

  db.query(sqlUpdate, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.post("/api/delete-recipe", (req, res) => {
  const recipeId = req.body.recipeId;
  const stepId = req.body.stepId;
  const tagId = req.body.tagId;
  const ingredientsId = req.body.ingredientsId;
  const sqlDelete = `delete from Recipe where recipeId = '${recipeId}'; delete from steps where stepId = '${stepId}'; delete from tags where tagId = '${tagId}'; delete from ingredients where ingredientsId = '${ingredientsId}';`;

  db.query(sqlDelete, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/users", (req, res) => {
  const sqlSelect = "select * from User;";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/user/:id", (req, res) => {
  const id = req.params.id;
  const sqlSelect = `select * from User where id = '${id}';`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/latest-recipes", (req, res) => {
  const sqlSelect = "select * from Recipe order by createDate desc;";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/recipe/:id", (req, res) => {
  const recipeId = req.params.id;
  const sqlSelect = `select * from recipe where recipeId = '${recipeId}';`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/recipe/ingredients/:id", (req, res) => {
  const ingredientsId = req.params.id;
  const sqlSelect = `select ingredient from ingredients where ingredientsId = '${ingredientsId}';`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/recipe/steps/:id", (req, res) => {
  const stepId = req.params.id;
  const sqlSelect = `select stepDesc from steps where stepId = '${stepId}' order by stepNumber asc;`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/recipe/tags/:id", (req, res) => {
  const tagId = req.params.id;
  const sqlSelect = `select tag from tags where tagId = '${tagId}';`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/most-liked-recipes", (req, res) => {
  const sqlSelect = "select * from recipe order by likes desc;";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/all-recipes", (req, res) => {
  const sqlSelect = "select * from recipe";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/my-recipes/:id", (req, res) => {
  const id = req.params.id;
  const sqlSelect = `select * from recipe where creatorId = '${id}'`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/recipe/all-tags/:id", (req, res) => {
  const id = req.params.id;
  const sqlSelect = `select * from tags where tagId != '${id}'`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/find-if-liked/:recipeId&:userId", (req, res) => {
  const recipeId = req.params.recipeId;
  const userId = req.params.userId;

  const sqlSelect = `select * from likes where recipeId = '${recipeId}' and userId = '${userId}';`;

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.get("/api/liked-recipes/:userId", (req, res) => {
  const userId = req.params.userId;

  const sqlSelect = `select r.* from recipe as r, likes as l where r.recipeId = l.recipeId and l.userId = '${userId}';`;

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("listening on port 3001");
});

