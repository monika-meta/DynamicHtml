'use strict';

const fs = require('fs');

let schema = fs.readFileSync('SchemaEnterprise.json');
let schemaJsonData = JSON.parse(schema);

let resource = fs.readFileSync('UIResourceExampleDummy.json');
let resourceJsonData = JSON.parse(resource);

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

conversion(schemaJsonData, resourceJsonData, objectTypeObjectDummy, relationObectDummy, propertiesObjectDummy);
function conversion(schemaJsonData, resourceJsonData, objectTypeObjectDummy, relationObectDummy, propertiesObjectDummy) {

  resourceJsonData.schema.id = schemaJsonData.$id;
  resourceJsonData.schema.title.en = schemaJsonData.title;
  resourceJsonData.schema.description.en = schemaJsonData.description;

  let definitionsKeys = Object.keys(schemaJsonData.definitions);


  for (let j = 0; j < definitionsKeys.length; j++) {
    console.log("definitionsKeys[j]",j, definitionsKeys[j])
    objectTypeObjectDummy.id = definitionsKeys[j]
    objectTypeObjectDummy.title = schemaJsonData.definitions[definitionsKeys[j]].title
    objectTypeObjectDummy.description.en = schemaJsonData.definitions[definitionsKeys[j]].description
    let propertieKeys = Object.keys(schemaJsonData.definitions[definitionsKeys[j]].properties);
    let properties = Object.assign({}, schemaJsonData.definitions[definitionsKeys[j]].properties);

    for (let i = 0; i < propertieKeys.length; i++) {

      let relation;
      let key = propertieKeys[i];
      relation = properties[key]['$ref'] && properties[key]['$ref'].split('/definitions/')[1];
      if (properties[key]['$ref'] && relation == 'contains' || relation == 'containedby' || relation == 'organizes' || relation == 'organizedby' || relation == 'assignedto' || relation == 'assignedhas') {
        relationObectDummy.id = key;
        relationObectDummy.type = relation;
        relationObectDummy.typeref = relation;
        relationObectDummy.title.en = JSON.stringify(properties[key].title);
        console.log("relationObectDummy.title.en", relationObectDummy.title.en)
        relationObectDummy.description.en = JSON.stringify(properties[key].description);
        let clonedrelationObectDummy = Object.assign({}, relationObectDummy);
        console.log("relationObectDummy.title.en", relationObectDummy)

        objectTypeObjectDummy.relations.push(clonedrelationObectDummy);
      } else {
        propertiesObjectDummy.id = key;
        propertiesObjectDummy.type = "string";
        propertiesObjectDummy.typeref = "objname";
        propertiesObjectDummy.required = true;
        propertiesObjectDummy.componentref.id = "input";
        propertiesObjectDummy.title.en = properties[key].title;
        propertiesObjectDummy.placeholder.en = "Enter " + properties[key].title;
        propertiesObjectDummy.description.en = properties[key].description;
        let clonedPropertiesObjectDummy = Object.assign({}, propertiesObjectDummy);
        objectTypeObjectDummy.properties.push(clonedPropertiesObjectDummy);
      }
    }

    let clonedObjectTypeObjectDummy = Object.assign({}, objectTypeObjectDummy);
    // console.log("cloned/ObjectTypeObjectDummy ", clonedObjectTypeObjectDummy);

    resourceJsonData.schema.objtypes.push(clonedObjectTypeObjectDummy)


  }

  fs.writeFileSync('json/UIResourceExample.json', JSON.stringify(resourceJsonData));

}