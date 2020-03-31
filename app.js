'use strict';

const fs = require('fs');

let schema = fs.readFileSync('SchemaEnterprise.json');
let schemaUIResourceData = JSON.parse(schema);

let resource = fs.readFileSync('UIResourceExampleDummy.json');
let resourceUIResourceData = JSON.parse(resource);



let objectTypeObjectDummy = {
  "id": "",
  "title": {
    "en": ""
  },
  "description": {
    "en": ""
  },
  "relations": [],
  "properties": [],
  "messagecodes": [
    {
      "code": 101,
      "title": {
        "en": "Error Message"
      },
      "description": {
        "en": "Do Something"
      }
    }
  ]
}
let relationObectDummy = {
  "id": "",
  "type": "",
  "typeref": "",
  "title": {
    "en": ""
  },
  "description": {
    "en": ""
  }
}

let propertiesObjectDummy = {
  "id": "",
  "type": "",
  "typeref": "",
  "required": true,
  "componentref": {
    "id": ""
  },
  "title": {
    "en": ""
  },
  "placeholder": {
    "en": ""
  },
  "description": {
    "en": ""
  }
}

conversion(schemaUIResourceData, resourceUIResourceData, objectTypeObjectDummy, relationObectDummy, propertiesObjectDummy);
function conversion(schemaUIResourceData, resourceUIResourceData, objectTypeObjectDummyData, relationObectDummy, propertiesObjectDummy) {

  resourceUIResourceData.schema.id = schemaUIResourceData.$id;
  resourceUIResourceData.schema.title.en = schemaUIResourceData.title;
  resourceUIResourceData.schema.description.en = schemaUIResourceData.description;

  let definitionsKeys = Object.keys(schemaUIResourceData.definitions);
  let objectTypeObjectDummy = Object.assign({}, objectTypeObjectDummyData);

  for (let j = 0; j < definitionsKeys.length; j++) {
    objectTypeObjectDummy.id = definitionsKeys[j]
    objectTypeObjectDummy.title = schemaUIResourceData.definitions[definitionsKeys[j]].title
    objectTypeObjectDummy.description.en = schemaUIResourceData.definitions[definitionsKeys[j]].description
    let propertieKeys = Object.keys(schemaUIResourceData.definitions[definitionsKeys[j]].properties);
     let properties = schemaUIResourceData.definitions[definitionsKeys[j]].properties;
     let relations = [];
     let property = []
    for (let i = 0; i < propertieKeys.length; i++) {
        let key = propertieKeys[i];
        let relation = properties[key]['$ref'] && properties[key]['$ref'].split('/definitions/')[1];
        let title = { en: properties[key].title };
        let description = { en: properties[key].description };
        let placeholder = { en: "Enter " + properties[key].title };

        if (isRelation(properties,key, relation)) {
            relationObectDummy.id = key;
            relationObectDummy.type = relation;
            relationObectDummy.typeref = relation;
            relationObectDummy.title = title;
            relationObectDummy.description = description;
            let clonedrelationObectDummy = Object.assign({}, relationObectDummy);

            relations.push(clonedrelationObectDummy);

          } else {
            propertiesObjectDummy.id = key;
            propertiesObjectDummy.type = "string";
            propertiesObjectDummy.typeref = "objname";
            propertiesObjectDummy.required = true;
            propertiesObjectDummy.componentref.id = "input";
            propertiesObjectDummy.title.en = title;
            propertiesObjectDummy.placeholder = placeholder;
            propertiesObjectDummy.description = description;
            let clonedPropertiesObjectDummy = Object.assign({}, propertiesObjectDummy);
            
            property.push(clonedPropertiesObjectDummy);
          }
          
    }

    objectTypeObjectDummy.relations =  relations;
    objectTypeObjectDummy.properties = property ;

    let clonedObjectTypeObjectDummy = Object.assign({}, objectTypeObjectDummy);
    // console.log("cloned/ObjectTypeObjectDummy ", clonedObjectTypeObjectDummy);

    resourceUIResourceData.schema.objtypes.push(clonedObjectTypeObjectDummy)
  }
  fs.writeFileSync('json/UIResourceExample.json', JSON.stringify(resourceUIResourceData, null , 4));

  let UIResource = fs.readFileSync('json/UIResourceExample.json');
  let UIResourceData = JSON.parse(UIResource);

  

for (let i = 0; i < UIResourceData.schema.objtypes.length; i++) {
    let propertiesArr = UIResourceData.schema.objtypes[i].properties;
    let formId = UIResourceData.schema.objtypes[i].id;
    // console.log('formId', formId)
    // console.log("propertiesArr", propertiesArr)
    generateForm(propertiesArr, formId);
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
  
  function generateForm(propertiesArr, formId) {
    let htmlTemplate = generateFormHeader(formId);
    propertiesArr.forEach(element => {
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
    console.log('formId', formId)
    console.log('html/'+formId+'.html')

    var stream = fs.createWriteStream('html/'+formId+'.html');
    stream.once('open', function (fd) {
      var html = htmlTemplate;
  
      stream.end(html);
    });
    // console.log("Generated Form*   : ", htmlTemplate);
  
  }
}

function isRelation(properties,key, relation){
if(properties[key]['$ref'] && relation == 'contains' || relation == 'containedby' || relation == 'organizes' || relation == 'organizedby' || relation == 'assignedto' || relation == 'assignedhas'){
    return true;
}
return false;
}