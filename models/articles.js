const mongoose = require("mongoose");


const ArticlesSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  img: {
    type: String,
  },

  type: {
    type: String,
},
pillar: {
    type: String,
},

author: {
    type: String, 
},
title: {
    type: String, 
},
by_line: {
    type: String,
}, 
header : {
    type : String
},
sub_header : {
    type : String
},
source_url : {
    type : String
},
content : {
    type : String
},
banner_image : {
    type : String
},
banner_link: {
    type : String
},  
life_stage_tag: {
    type : Array
},
persona_tag: {
    type : Array
},
interest_tags:
{
    type : Array
},
point:{
    type : Number
},
duration:{
    type : Number
},
publish:{
    type:Boolean
},
date_published:{
    type:String
}


  
});

const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;
