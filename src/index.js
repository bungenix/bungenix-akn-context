import {schemaData} from './schema';

/**
 * Gets the schema content
 */
const schemaContent = () => schemaData;

/**
 * Converts Attribute id to Attribute name
 * @param {*} id 
 */
const attrNameFromId = (id) => schemaContent().em.atnd[id];

/**
 * Converts Type id to Attribute Type
 * @param {*} id 
 */
const attrTypeFromId = (id) => schemaContent().em.attd[id];

/**
 * Converts Element id to Element name
 * @param {*} id 
 */
const elemNameFromId = (id) => schemaContent().em.emu[id];

/**
 * Partial name of the element
 * @param {string} elementPartial - partial name of the element (starting letters)
 * @returns array of element names starting with the partial name
 */
export const findElements = (elementPartial) => {
    const foundElement = schemaContent().elements.filter( (element) => element.n.startsWith(elementPartial) );
    return foundElement.map( elem => elem.n );
};

/**
 * Gets context info about an Akoma Ntoso Element. 
 * Takes the name of an element as an input, and returns its child elements, attributes, and its possible parent elements
 * @param {*} elementName - excact name of the element
 */
export const elementContext = (elementName) => {
  const foundElement = schemaContent().elements.filter( (element) => element.n === elementName );
  var context = {
    "childElements": [],
    "attributes": [],
    "parentElements": []
  };
  if (foundElement.length === 0) {
    return {"error": "ELEMENT_NOT_FOUND"};
  } else {
    if ("c" in foundElement[0]) {
      context.childElements = foundElement[0].c.map( 
        (elem) => {
          var obj = { name: elemNameFromId(elem.f) };
          if ("m" in elem ) {
            obj.minOccurs = elem.m ;
          }
          if ("x" in elem) {
            obj.maxOccurs = elem.x ;
          }
          return obj;
        }
      );
    }
    
    // find elements where this element is a child !
    const foundParents = schemaContent().elements.filter( (element) => {
      if ("c" in element) {
        const foundElementAsChild = element.c.filter( (element) => elemNameFromId(element.f) === elementName );
        if (foundElementAsChild.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });

    if (foundParents.length > 0) {
      context.parentElements = foundParents.map( (elem) => elem.n );
    }

    if ("at" in foundElement[0]) {
      const foundAttrs = foundElement[0].at.map( (attr) => {
        let attrObj =  {
          name: attrNameFromId(attr.n)
        };
        if ("t" in attr) {
          attrObj.type = attrTypeFromId(attr.t); 
        }
        if ("u" in attr) {
          attrObj.usage = attr.u === "o" ? "optional": "required";  
        }
        return attrObj;
      });
      context.attributes = foundAttrs;
    }
    return context ;     
  }
};


