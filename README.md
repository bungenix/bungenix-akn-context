# Akn-Element-Context

This library will be useful to you if you are a tool developer around Akoma Ntoso XML documents. Ever wanted to query the context of an element? Know its possible attributes, and its possible child elements? This will do just that. This is a very fast implementation that is pure native JS, and does not make use of *any* XPath or XML Schema introspection. 

## API

`findElements`

This returns possible element names for a partial set of starting characters. 

For example:

```
import {findElements} from 'akn-element-context';
...
const elementsStartingWithP = findElements("p");
```


`elementContext`

Returns the element context information for an element

For example: 

```
import {elementContext} from 'akn-element-context';
...
const elemPart = elementContext("part");
```

Returns the following: 

```
{
  
}


[![NPM](https://img.shields.io/npm/v/akn-element-context.svg)](https://www.npmjs.com/package/akn-element-context) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save akn-element-context
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'akn-element-context'

class Example extends Component {
  render () {
    return (
      <MyComponent />
    )
  }
}
```

## License

AGPL-3.0 © [kohsah](https://github.com/kohsah)
