'use strict';

const fs = require('fs');
const document = require('document');

let rawdata = fs.readFileSync('UIResourceExample.json');
let jsonData = JSON.parse(rawdata);
console.log(jsonData);

let properties = jsonData.schema.objtypes[0].properties;
let formId = jsonData.schema.objtypes[0].id;
let htmlTemplate = generateFormHeader(formId);

function generateFormHeader(options) {
    return `
    <mbsc-form [options]="${options}">
    <mbsc-form-group>
    `
  };

 function  generateFormFooter() {
    return `
    </mbsc-form-group>
    <mbsc-button>Submit</mbsc-button>
    </mbsc-form>
    `
  }
  function generateInput(ngModel , placeholder){
    return `
    <mbsc-input
    [(ngModel)]="${ngModel}"
    [placeholder]="${placeholder}"
    ></mbsc-input>
    `
  }

  function  generateSelect(ngModel , options, data, onSet){
    return `
    <mbsc-select
    [(ngModel)]="${ngModel}"
    [options]="${options}"
    [data]="${data}"
    (onSet)="${onSet}"
    ></mbsc-select>
    `
  }

properties.forEach(element => {
  let temp;
  if(element.componentref.id == "input"){
   temp = generateInput(formId+'.'+element.id, formId+'.placeholder',)
  }else if(element.componentref.id == "select"){
  temp =  generateSelect(formId+'.'+element.id, '', element.enumvals, formId+'.'+element.id+'.onSelect($event)')
  }
  htmlTemplate = htmlTemplate + temp;
});
htmlTemplate = htmlTemplate + generateFormFooter();

var fileName = 'index.html';
var stream = fs.createWriteStream(fileName);
stream.once('open', function(fd) {
    var html = htmlTemplate;
  
    stream.end(html);
  });


console.log("Generated Form*   : ", htmlTemplate);
