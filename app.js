//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();


app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")


.get(function(req, res){
  Article.find(function(err, articles){
    if (articles) {
      const jsonArticles = JSON.stringify(articles);
      res.send(jsonArticles);
    } else {
      res.send("No articles currently in wikiDB.");
    }
  });
})

.post(function(req, res){
  const newArticle = Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all the articles in wikiDB.");
    } else {
      res.send(err);
    }
  });

});

app.route("/articles/:articleTitle")

.get(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.findOne({title:articleTitle}, function(err,article){
        if (!err){
            const stringArticle = JSON.stringify(article);
            res.send(stringArticle);
        } else {
            res.send("No articles Found")
        }
    })
})

.patch(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.updateOne({
        name: articleTitle},
        {content: req.params.newContent}
    ,function(err){
        if(!err){
            res.send("Sucessfully Updated");
        }else{
            res.send(err);
        }
    });
})

.put(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.updateOne({
        title: articleTitle},
        {content: req.params.content},
        {overwrite:true},
    function(err){
        if(!err){
            res.send("Sucessfully Updated");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.deleteOne({name: articleTitle}, function(err){
        if(!err){
            res.send("Sucessfully Deleted!!!")
        }else{
            res.send(err)
        }
    })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});