const fs = require('fs');

var docSchema = require('./schema.json');

const coerceIntoArray = (obj) => {
    return Array.isArray(obj) ? obj: (obj === undefined ? []: [obj] ) ;
};

const isObject = (obj) => {
    var type = typeof obj;
    if (Array.isArray(obj)) {
      return false;
    } else {
      return type === 'function' || type === 'object' && !!obj;
    }
  };
  

const checkFacet = (item) => {
    if ("facets" in item) {
        item.facets = coerceIntoArray(item.facets.facet);
    }
    return item;
};

const checkProperty = (item) => {
    if ("properties" in item) {
        item.facets = coerceIntoArray(item.properties.property);
    }
    return item;
};

const checkUsedBy = (item) => {
    if ("usedByItems" in item) {
        item.usedByItems = coerceIntoArray(item.usedByItems.itemType);
    }
    return item;    
};

const checkChildElement = (item) => {
    if ("childElements" in item) {
        if ("childElement" in item.childElements) {
            item.childElements = coerceIntoArray(item.childElements.childElement);
        }
    }
    return item;    
};

const checkHasAttributes = (item) => {
    if ("hasAttributes" in item) {
        if ("hasAttribute" in item.hasAttributes) {
            item.hasAttributes = coerceIntoArray(item.hasAttributes.hasAttribute);
        }
    }
    return item;    
};


const remapElementOrComplexTypes = (item) => {
    item = checkUsedBy(item);
    item = checkChildElement(item);
    item = checkHasAttributes(item);
    item = checkFacet(item);
    item = checkProperty(item);
    item = deleteProps(item);
    return item;
};

const deleteProps = (item) => {
    if ("img" in item) {
        delete item.img;
    }
    if ("desc" in item) {
        delete item.desc;
    }
    return item;
};


const cleanup = () => {
    
    const schema = docSchema.schema;

    /** high level convert */
    schema.elements = coerceIntoArray(schema.elements.element);
    /*
    schema.complexTypes =  coerceIntoArray(schema.complexTypes.complexType);
    schema.simpleTypes =  coerceIntoArray(schema.simpleTypes.simpleType);
    schema.elementGroups =  coerceIntoArray(schema.elementGroups.elementGroup);
    schema.attributes =  coerceIntoArray(schema.attributes.attribute);
    schema.attributeGroups =  coerceIntoArray(schema.attributeGroups.attributeGroup);
    */
    
    
    
    /** fix eleements  */
    
    schema.elements = schema.elements.map( 
        (item) => remapElementOrComplexTypes(item)
    );

    return schema;

};


const shortenIds = () => {
    var schema = docSchema.schema; 
    schema.elements = schema.elements.map( (elem) => {
        elem.n = elem.name; 
        delete elem.name;
        delete elem.eid;
        if ("usedByItems" in elem) {
            delete elem.usedByItems;
        }
        if ("childElements" in elem) {
            elem.childElements = elem.childElements.map( (cel) => {
                cel.f = cel.forId;
                delete cel.forId;
                delete cel.content;
                if ("minOccurs" in cel) {
                    cel.m = cel.minOccurs;
                    delete cel.minOccurs;
                }
                if ("maxOccurs"in cel) {
                    cel.x = cel.maxOccurs;
                    delete cel.maxOccurs;
                }
                return cel;
            });
            elem.c = elem.childElements;
            delete elem.childElements;
        }

        if ("hasAttributes" in elem) {
            elem.hasAttributes = elem.hasAttributes.map ( at => {
                at.n = at.name ; 
                
                if ("usage" in at) {
                    at.u = at.usage === "optional" ? "o" : "r";
                }
                if ("type" in at) {
                    at.t = isObject(at.type) ? at.type.content: at.type;
                }

                delete at.name ;
                delete at.usage;
                delete at.type;
                delete at.link;

                return at;
            });
            elem.at = elem.hasAttributes;
            delete elem.hasAttributes;
        }
        return elem;
    });
    return schema;
};

const removeUnused = () => {
    var schema = docSchema.schema;
    delete schema.xmlns;
    delete schema.complexTypes;
    delete schema.simpleTypes;
    delete schema.elementGroups;
    delete schema.attributes;
    delete schema.attributeGroups;
    return schema;
};


const domToString = () => {
    var schemaStr = JSON.stringify(docSchema.schema);
    schemaStr = schemaStr.replace(/http___docs.oasis-open.org_legaldocml_ns_akn_3.0_/g, "");
    return schemaStr ;
}


const reMapVals = () => {
    var elementMap = {"emu": {}, "emd": {}, "attu": {}, "attd": {}, "atnu": {}, "atnd": {}};
    var attrTypes = [];
    var attrNames = [];
    var schema = docSchema.schema;
    // remap elements
    // build map of element names with num index
    schema.elements.map( (el, index) => {
        elementMap.emu[index] = el.n ;
        elementMap.emd[el.n] = index;
        }  
    );
    
    // finad all attribute types
    // build a index map of attr types
    schema.elements.map( (el, index) => {
        if (Array.isArray(el.at)) {
            el.at.map( (elat, index) => { 
                attrTypes.includes(elat.t) ? undefined: attrTypes.push(elat.t);
                attrNames.includes(elat.n) ? undefined: attrNames.push(elat.n);
            });
        }  
    });

    attrTypes.map( (artype, index) => {
        elementMap.attu[artype] = index ;
        elementMap.attd[index] = artype;
    } );
    
    attrNames.map( (atname, index) => {
        elementMap.atnu[atname] = index ; 
        elementMap.atnd[index] = atname;
    });

    schema.elements = schema.elements.map( el => {
        // REMAP CHILD ELEMENTS
        if (Array.isArray(el.c)) {
            el.c = el.c.map( elch => {
                elch.f = elementMap.emd[elch.f];
                if (elch.f === undefined) {
                    console.log(" undefined == ", el);
                }
                return elch;
            });
        }

        // REMAP ARRAY TYPES
        if (Array.isArray(el.at)) {
            el.at = el.at.map( elat => {
                elat.t = elementMap.attu[elat.t];
                elat.n = elementMap.atnu[elat.n];
                return elat;
            });
        }
    
        //el.n = elementMap.emd[el.n];
    
        return el;
    });
    

    delete elementMap.atnu; 
    delete elementMap.attu;
    delete elementMap.emd;

    schema.em = elementMap;

    return schema;
}

docSchema.schema = cleanup();
docSchema.schema = removeUnused();
docSchema.schema = shortenIds();
var schemaStr = domToString();
docSchema.schema = JSON.parse(schemaStr);
docSchema.schema = reMapVals();
var schemaStr2 = domToString();

/*
var elementMap = {"emu": {}, "emd": {}, "attu": {}, "attd": {}};

var attrTypes = [];


schema.elements.map( (el, index) => {
    elementMap.emu[index] = el.n ;
    elementMap.emd[el.n] = index;
}  );

// finad all attribute names

schema.elements.map( (el, index) => {
    if (Array.isArray(el.at)) {
        el.at.map( (elat, index) => attrTypes.includes(elat.t) ? undefined: attrTypes.push(elat.t));
    }  
});

attrTypes.map( (artype, index) => {
    elementMap.attu[artype] = index ;
    elementMap.attd[index] = artype;
} );




schema.elements = schema.elements.map( el => {
    if (Array.isArray(el.ch)) {
        el.ch = el.ch.map( elch => {
            elch.f = elementMap.emd[elch.f];
            if (elch.f === undefined) {
                console.log(" undefined == ", el);
            }
            return elch;
        });
    }

    //el.n = elementMap.emd[el.n];

    return el;
});

schema.em = elementMap;
*/
/*
schema.complexTypes = schema.complexTypes.map(
    (item) => remapElementOrComplexTypes(item)
);

schema.simpleTypes = schema.simpleTypes.map(
    (item) => remapElementOrComplexTypes(item)
);

schema.elementGroups = schema.elementGroups.map(
    (item) => remapElementOrComplexTypes(item)
);

schema.attributes = schema.attributes.map(
    (item) => remapElementOrComplexTypes(item)
);

schema.attributeGroups = schema.attributeGroups.map(
    (item) => remapElementOrComplexTypes(item)
);
*/



fs.writeFileSync("./schema_remap.json", schemaStr2, "utf8" );
