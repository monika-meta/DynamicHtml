'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('UIResourceExample.json');
let jsonData = JSON.parse(rawdata);
// console.log(jsonData);



for (let i = 0; i < jsonData.schema.objtypes.length; i++) {
  let properties = jsonData.schema.objtypes[0].properties;
  let formId = jsonData.schema.objtypes[i].id;
  generateForm(properties, formId);
}

function generateFormHeader(options) {
  return `
    <mbsc-form [options]="${options}">
    <mbsc-form-group>
    `
};

function generateFormFooter() {
  return `
    </mbsc-form-group>
    <mbsc-button>Submit</mbsc-button>
    </mbsc-form>
    `
}
function generateInput(ngModel, placeholder) {
  return `
    <mbsc-input
    [(ngModel)]="${ngModel}"
    [placeholder]="${placeholder}"
    ></mbsc-input>
    `
}

function generatePassword(ngModel, type, placeholder) {
  return `
    <mbsc-input
     [(ngModel)]="${ngModel}"
     type="${type}"
     placeholder="${placeholder}">
     </mbsc-input>
    `
}

function generateTextArea(ngModel, placeholder) {
  return `
    <mbsc-textarea 
    [(ngModel)]="${ngModel}" 
    placeholder="${placeholder}">
    </mbsc-textarea>
    `
}

function generateEmail(ngModel, type, placeholder) {
  return `
    <mbsc-input 
    [(ngModel)]="${ngModel}" 
    type="${type}" 
    placeholder="${placeholder}">
    </mbsc-input>
    `
}

function generateNumber(ngModel, type, placeholder) {
  return `
    <mbsc-input 
    [(ngModel)]="${ngModel}" 
    type="${type}" 
    placeholder="${placeholder}">
    </mbsc-input>
    `
}


function generateSelect(ngModel, options, data, onSet) {
  return `
    <mbsc-select
    [(ngModel)]="${ngModel}"
    [options]="${options}"
    [data]="${data}"
    (onSet)="${onSet}"
    ></mbsc-select>
    `
}

function generateRadio(ngModel, data) {
  let radioGroupStart = `<mbsc-radio-group 
[(ngModel)]="${ngModel}">`;
  for (let i = 0; i < data.length - 1; i++) {
    let temp = `<mbsc-radio 
     [value]="${data[i].value}">
     </mbsc-radio>
     `
    radioGroupStart = radioGroupStart + temp;
  }
  radioGroupStart = radioGroupStart + '</mbsc-radio-group>'
  return radioGroupStart;
}

function generateCheckbox(ngModel, data, type, placeholder) {
  let checkbox = ``;
  for (let i = 0; i < data.length - 1; i++) {
    let temp = `<mbsc-checkbox
        [(ngModel)]="${ngModel}"
         (change)="regForm.checkboxChange()">{{data[i].label}}
         </mbsc-checkbox>
       `
    checkbox = checkbox + temp;
  }
  return checkbox;
}

function generateSwitch(ngModel) {
  return `
    <mbsc-switch
    [(ngModel)]="${ngModel}"
    ></mbsc-switch>
    `
}


function generateColor(ngModel, options, placeholder, enhance) {
  return `
  <mbsc-color 
  [(ngModel)]="${ngModel}" 
  [options]="${options}" 
  [placeholder]="${placeholder}" 
  enhance="${enhance}">
  </mbsc-color>
    `
}

function generateForm(properties, formId) {
  let htmlTemplate = generateFormHeader(formId);
  properties.forEach(element => {
    let temp;
    switch (element.componentref.id) {
      case "input":
        temp = generateInput(formId + '.' + element.id, 'regForm.placeholder')
        break;
      case "password":
        temp = generatePassword(formId + '.' + element.id, element.componentref.id, 'regForm.placeholder')
        break;
      case "inputArea":
        temp = generateTextArea(formId + '.' + element.id, 'regForm.placeholder')
        break;
      case "email":
        temp = generateEmail(formId + '.' + element.id, element.componentref.id, 'regForm.placeholder')
        break;
      case "number":
        temp = generateNumber(formId + '.' + element.id, element.componentref.id, 'regForm.placeholder')
        break;
      case "select":
        temp = generateSelect(formId + '.' + element.id, '', 'regForm.' + element.id + '.data', 'regForm.' + element.id + '.onSelect($event)')
        break;
      case "switch":
        temp = generateSwitch(formId + '.' + element.id)
        break;
      case "color":
        temp = generateColor(formId + '.' + element.id, 'regForm.' + element.id + '.options', 'regForm.placeholder')
        break;
      default:
      // code block
    }
    htmlTemplate = htmlTemplate + temp;
  });
  htmlTemplate = htmlTemplate + generateFormFooter();

  var stream = fs.createWriteStream(formId+'.html');
  stream.once('open', function (fd) {
    var html = htmlTemplate;

    stream.end(html);
  });
  // console.log("Generated Form*   : ", htmlTemplate);

}





