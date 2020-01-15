# BungeniX-AKN-Context

This Javascript library will be useful to you if you are a tool developer working with Akoma Ntoso XML (AKN) documents. 

Ever wanted to query the context of an element? Know its possible attributes, and its possible allowed child or parent elements? This will do just that. 

bungenix-akn-context is a very fast implementation that is pure native JS, and does not make use of *any* XPath or XML Schema introspection.

A common use case for such a library is for a AKN markup editor:

The user is in the body of a document, and you want to perhaps pop-up a menu on right-click with possible elements within the main body of the document, then if you chose a preface, and right click within the preface you want to add a new allowed element for the preface, and so on. 

You can essentially build a complete document tree or an element tree within a document with this library without invoking XPath or introspecting the schema. 

Usable both in-browser (tested on ReactJS and SvelteJS) and on the server side with NodeJS. 

## Live Example

[Example](https://bungenix.gitlab.io/bungenix-akn-context-example/)


## Install

```
npm install --save bungenix-akn-context
```

## API

### API: `findElements`

This returns possible element names for a partial set of starting characters. 

For example:

```
import {findElements} from 'akn-element-context';
...
const elementsStartingWithpa = findElements("pa");

console.log(elementsStartingWithpa);
```

This returns a list of AKN elements starting with the pattern "pa":
```
[
  "paragraph",
  "parliamentary",
  "part",
  "party",
  "passiveModifications",
  "passiveRef"
]
```



### API: `elementContext`

Returns the element context information for an element

For example: 

```
import {elementContext} from 'akn-element-context';
...
const elemPart = elementContext("preface");
```

Returns the following an object with context specific information about the element in terms of its allowed `childElements`, `attributes` and `parentElements`. The below for example are the allowed child elements, parent elements and attributes for a Akoma Ntoso `preface` element.

```
{
    "childElements": [
        {"name": "blockList"},
        {"name": "blockContainer"},
        {"name": "tblock"},
        {"name": "toc"},
        {"name": "ul"},
        {"name": "ol"},
        {"name": "table"},
        {"name": "p"},
        {"name": "foreign"},
        {"name": "block"},
        {"name": "longTitle"},
        {"name": "formula"},
        {"name": "container"}
    ],
    "attributes": [
        {
            "name": "GUID",
            "type": "noWhiteSpace",
            "usage": "optional"
        },
        {
            "name": "alternativeTo",
            "type": "eIdRef",
            "usage": "optional"
        },
        {
            "name": "class",
            "type": "xsd:string",
            "usage": "optional"
        },
        {
            "name": "eId",
            "type": "noWhiteSpace",
            "usage": "optional"
        },
        {
            "name": "period",
            "type": "temporalGroupRef",
            "usage": "optional"
        },
        {
            "name": "refersTo",
            "type": "list of referenceRef",
            "usage": "optional"
        },
        {
            "name": "status",
            "type": "statusType",
            "usage": "optional"
        },
        {
            "name": "style",
            "type": "xsd:string",
            "usage": "optional"
        },
        {
            "name": "title",
            "type": "xsd:string",
            "usage": "optional"
        },
        {
            "name": "wId",
            "type": "noWhiteSpace",
            "usage": "optional"
        },
        {
            "name": "xml:id",
            "type": "xs:ID",
            "usage": "optional"
        },
        {
            "name": "xml:lang",
            "type": "union of(xs:language, restriction of xs:string)",
            "usage": "optional"
        },
        {
            "name": "xml:space",
            "type": "restriction of xs:NCName",
            "usage": "optional"
        }
    ],
    "parentElements": [
        "act",
        "amendment",
        "amendmentList",
        "bill",
        "debate",
        "debateReport",
        "doc",
        "documentCollection",
        "officialGazette",
        "portionBody",
        "statement"
    ]
}
```


## License

GPL-3.0 
