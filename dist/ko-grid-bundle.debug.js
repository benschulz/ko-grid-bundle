/**
 * @license Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
;(function(factory) {
    if (typeof define === 'function' && define['amd'])
        define(['require', 'knockout'], factory);
    else
        window['ko-grid-bundle'] = factory(function (configName, handler) {
                if (!Array.isArray(configName) || configName.length !== 1 || typeof configName[0] !== 'string' || typeof handler !== 'function')
                    throw new Error('Assertion error.');

                var store = window.ko.bindingHandlers['grid']['config'] = window.ko.bindingHandlers['grid']['config'] || {};
                handler(store[configName[0]]);
            }, window.ko);
} (function(req, knockout) {
/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
var onefold_js, onefold_lists, indexed_list, stringifyable, ko_data_source, ko_entry, onefold_dom, ko_indexed_repeat, ko_grid, ko_grid_aggregate, ko_grid_cell_navigation, ko_grid_column_sizing, ko_grid_column_resizing, ko_grid_view_modes, ko_grid_view_state_storage, ko_grid_column_scaling, ko_grid_column_width_persistence, ko_grid_editing, ko_grid_export, ko_grid_filtering, ko_grid_full_screen, ko_grid_links, ko_grid_resize_detection, ko_grid_selection, ko_grid_sorting, ko_grid_toolbar, ko_grid_virtualization, ko_grid_bundle_bundle, ko_grid_bundle;
onefold_js = function () {
  var onefold_js_objects, onefold_js_arrays, onefold_js_strings, onefold_js_internal, onefold_js;
  onefold_js_objects = function () {
    return {
      areEqual: areEqual,
      extend: extend,
      forEachProperty: forEachProperty,
      hasOwn: hasOwn,
      mapProperties: mapProperties
    };
    function areEqual(a, b) {
      if (a === b)
        return true;
      var aHasValue = !!a && typeof a.valueOf === 'function';
      var bHasValue = !!b && typeof b.valueOf === 'function';
      return aHasValue && bHasValue && a.valueOf() === b.valueOf();
    }
    function extend(object, extensions) {
      Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        var keys = Object.keys(source);
        for (var i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          var descriptor = Object.getOwnPropertyDescriptor(source, key);
          if (descriptor !== undefined && descriptor.enumerable)
            Object.defineProperty(object, key, descriptor);
        }
      });
      return object;
    }
    function forEachProperty(owner, action) {
      for (var propertyName in owner)
        if (hasOwn(owner, propertyName))
          action(propertyName, owner[propertyName]);
    }
    function hasOwn(owner, propertyName) {
      return Object.prototype.hasOwnProperty.call(owner, propertyName);
    }
    function mapProperties(source, mapper) {
      var destination = {};
      for (var propertyName in source)
        if (hasOwn(source, propertyName))
          destination[propertyName] = mapper(source[propertyName], propertyName, source);
      return destination;
    }
  }();
  onefold_js_arrays = function (objects) {
    return {
      contains: contains,
      distinct: distinct,
      flatMap: flatMap,
      single: single,
      singleOrNull: singleOrNull,
      stableSort: stableSortInPlace
    };
    function contains(array, value) {
      return array.indexOf(value) >= 0;
    }
    function distinct(array) {
      return array.length > 50 ? distinctForLargeArrays(array) : distinctForSmallArrays(array);
    }
    function distinctForSmallArrays(array) {
      return array.filter(function (e, i, a) {
        return a.lastIndexOf(e) === i;
      });
    }
    function distinctForLargeArrays(source) {
      var length = source.length, stringLookup = {}, value;
      for (var i = 0; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (objects.hasOwn(stringLookup, value))
            break;
          else
            stringLookup[value] = true;
        } else if (source.lastIndexOf(value) !== i) {
          break;
        }
      }
      if (i >= length)
        return source;
      var destination = source.slice(0, i);
      for (; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (!objects.hasOwn(stringLookup, value)) {
            stringLookup[value] = true;
            destination.push(value);
          }
        } else if (source.lastIndexOf(value) === i) {
          destination.push(value);
        }
      }
      return destination;
    }
    function flatMap(array, mapper) {
      return Array.prototype.concat.apply([], array.map(mapper));
    }
    function single(array, predicate) {
      var index = trySingleIndex(array, predicate);
      if (index < 0)
        throw new Error('None of the elements matches the predicate.');
      return array[index];
    }
    function singleOrNull(array, predicate) {
      var index = trySingleIndex(array, predicate);
      return index >= 0 ? array[index] : null;
    }
    function trySingleIndex(array, predicate) {
      var length = array.length, matchIndex = -1;
      for (var i = 0; i < length; ++i) {
        var element = array[i];
        if (predicate(element)) {
          if (matchIndex >= 0)
            throw new Error('Multiple elements match the predicate.');
          matchIndex = i;
        }
      }
      return matchIndex;
    }
    function stableSortInPlace(array, comparator) {
      return stableSort(array, comparator || naturalComparator, true);
    }
    function naturalComparator(a, b) {
      return a && typeof a.valueOf === 'function' && b && typeof b.valueOf === 'function' ? a.valueOf() <= b.valueOf() ? a.valueOf() < b.valueOf() ? -1 : 0 : 1 : a <= b ? a < b ? -1 : 0 : 1;
    }
    function stableSort(source, comparator, sortSource) {
      var isChrome = !!window['chrome'];
      var nativeSortIsStable = !isChrome;
      return nativeSortIsStable ? stableSortNative(source, comparator, sortSource) : stableSortCustom(source, comparator, sortSource);
    }
    function stableSortNative(source, comparator, sortSource) {
      var destination = sortSource === true ? source : source.slice();
      destination.sort(comparator);
      return destination;
    }
    function stableSortCustom(source, comparator, sortSource) {
      var length = source.length;
      var indexes = new Array(length);
      var destination = new Array(length);
      var i;
      // TODO performance benchark: would it be better copy source via .slice()?
      //      i would hope this does pretty much the same as .slice() but we give
      //      out-of-order execution the chance to absorb more cache misses until
      //      the prefetcher kicks in
      for (i = 0; i < length; ++i) {
        indexes[i] = i;
        destination[i] = source[i];
      }
      if (sortSource === true) {
        var tmp = source;
        source = destination;
        destination = tmp;
      }
      indexes.sort(function (a, b) {
        var byOrdering = comparator(source[a], source[b]);
        return byOrdering || a - b;
      });
      for (i = 0; i < length; ++i)
        destination[i] = source[indexes[i]];
      return destination;
    }
  }(onefold_js_objects);
  onefold_js_strings = {
    convertCamelToHyphenCase: function (camelCased) {
      return camelCased.replace(/([A-Z])/g, function (match) {
        return '-' + match.toLowerCase();
      });
    },
    convertHyphenToCamelCase: function (hyphenCased) {
      return hyphenCased.replace(/-([a-z])/g, function (match) {
        return match[1].toUpperCase();
      });
    },
    format: function (formatString) {
      var args = arguments;
      return formatString.replace(/{(\d+)}/g, function (match, number) {
        var argumentIndex = parseInt(number, 10) + 1;
        return typeof args.length <= argumentIndex ? match : args[argumentIndex];
      });
    }
  };
  onefold_js_internal = function (arrays, objects, strings) {
    return {
      arrays: arrays,
      objects: objects,
      strings: strings
    };
  }(onefold_js_arrays, onefold_js_objects, onefold_js_strings);
  onefold_js = function (main) {
    return main;
  }(onefold_js_internal);
  return onefold_js;
}();
onefold_lists = function (onefold_js) {
  var onefold_lists_internal, onefold_lists;
  onefold_lists_internal = function (js) {
    function prototyper(extensions) {
      var internal = {
        get length() {
          return this['length'];
        },
        contains: function (value) {
          return this.tryFirstIndexOf(value) >= 0;
        },
        filter: function (predicate) {
          var length = this.length, array = [];
          for (var i = 0; i < length; ++i) {
            var element = this.get(i);
            if (predicate(element, i, this))
              array.push(element);
          }
          return new ArrayList(array);
        },
        forEach: function (action) {
          var length = this.length;
          for (var i = 0; i < length; ++i)
            action(this.get(i), i, this);
        },
        get: function (index) {
          return this['get'](index);
        },
        map: function (mapping) {
          var length = this.length, array = new Array(length);
          for (var i = 0; i < length; ++i)
            array[i] = mapping(this.get(i), i, this);
          return new ArrayList(array);
        },
        readOnly: function () {
          return new ReadOnlyListView(this);
        },
        reduce: function (accumulator, identity) {
          var initialValueSpecified = arguments.length > 1;
          var length = this.length;
          if (!initialValueSpecified && length === 0)
            throw new TypeError('An empty list can not be reduced, specify an initial value.');
          var aggregate = initialValueSpecified ? identity : this.get(0);
          for (var i = initialValueSpecified ? 0 : 1; i < length; ++i)
            aggregate = accumulator(aggregate, this.get(i));
          return aggregate;
        },
        slice: function (beginIndex, endIndex) {
          var length = this.length;
          beginIndex = arguments.length <= 0 ? 0 : beginIndex >= 0 ? beginIndex : length + beginIndex;
          endIndex = arguments.length <= 1 ? length : endIndex >= 0 ? endIndex : length + endIndex;
          var resultLength = endIndex - beginIndex;
          var array = new Array(resultLength);
          for (var i = 0; i < resultLength; ++i) {
            array[i] = this.get(beginIndex + i);
          }
          return new ArrayList(array);
        },
        toArray: function () {
          var length = this.length, array = new Array(length);
          for (var i = 0; i < length; ++i)
            array[i] = this.get(i);
          return array;
        },
        tryFirstIndexOf: function (value) {
          var length = this.length;
          for (var i = 0; i < length; ++i)
            if (this.get(i) === value)
              return i;
          return -1;
        }
      };
      var exported = {
        get 'length'() {
          return this.length;
        },
        'contains': internal.contains,
        'filter': internal.filter,
        'forEach': internal.forEach,
        'get': function (index) {
          return this.get(index);
        },
        'map': internal.map,
        'readOnly': internal.readOnly,
        'reduce': internal.reduce,
        'slice': internal.slice,
        'toArray': internal.toArray,
        'tryFirstIndexOf': internal.tryFirstIndexOf
      };
      return js.objects.extend(internal, exported, extensions);
    }
    /**
     * @constructor
     * @template E
     *
     * @param {Array<E>} array
     */
    function ArrayList(array) {
      this.__array = array;
    }
    ArrayList.prototype = prototyper({
      get length() {
        return this.__array.length;
      },
      get: function (index) {
        return this.__array[index];
      },
      toArray: function () {
        return this.__array.slice();
      }
    });
    /**
     * @constructor
     * @template E
     *
     * @param {de.benshu.onefold.lists.List<E>} list
     */
    function ReadOnlyListView(list) {
      this.__list = list;
    }
    ReadOnlyListView.prototype = prototyper({
      get length() {
        return this.__list.length;
      },
      get: function (index) {
        return this.__list.get(index);
      }
    });
    return {
      newArrayList: function (array) {
        return new ArrayList(array || []);
      },
      listPrototype: prototyper
    };
  }(onefold_js);
  onefold_lists = function (main) {
    return main;
  }(onefold_lists_internal);
  return onefold_lists;
}(onefold_js);
indexed_list = function (onefold_lists, onefold_js) {
  var indexed_list_indexed_list, indexed_list;
  indexed_list_indexed_list = function (js, lists) {
    function checkId(id) {
      if (typeof id !== 'string')
        throw new Error('Ids must be strings. (given: `' + id + '`, type: `' + typeof id + '`)');
      return id;
    }
    // TODO consider calling the following functions with explicit `this` rather than passing symbol values
    function idOf(idSelector, element) {
      return idSelector(element);
    }
    function tryIndexOfById(elementIdToIndex, id) {
      return js.objects.hasOwn(elementIdToIndex, checkId(id)) ? elementIdToIndex[id] : -1;
    }
    function indexOfById(elementIdToIndex, id) {
      var index = tryIndexOfById(elementIdToIndex, id);
      if (index < 0)
        throw new Error('No element with id `' + id + '`.');
      return index;
    }
    function findInsertionIndex(elements, comparator, element, fromIndex, toIndex) {
      if (fromIndex >= toIndex)
        return fromIndex;
      var middle = Math.floor((fromIndex + toIndex) / 2);
      return comparator(element, elements[middle]) < 0 ? findInsertionIndex(elements, comparator, element, fromIndex, middle) : findInsertionIndex(elements, comparator, element, middle + 1, toIndex);
    }
    function reconstructElements(idSelector, originalElements, elementIdToIndex, indizes, inbetween) {
      var reconstructedElements = [];
      var appendSlice = function (fromIndex, toIndex) {
        var baseIndex = reconstructedElements.length;
        var slice = originalElements.slice(fromIndex, toIndex);
        reconstructedElements = reconstructedElements.concat(slice);
        slice.forEach(function (row) {
          elementIdToIndex[idSelector(row)] = baseIndex;
          ++baseIndex;
        });
      };
      var offset = 0;
      indizes.forEach(function (index) {
        appendSlice(offset, index);
        offset = index;
        inbetween(reconstructedElements);
      });
      appendSlice(offset, originalElements.length);
      return reconstructedElements;
    }
    function IndexedList(idSelector) {
      this.idSelector = function (element) {
        return checkId(idSelector(element));
      };
      this.__elements = [];
      this.__elementIdToIndex = {};
      this.__comparator = null;
    }
    IndexedList.prototype = lists.listPrototype({
      get length() {
        return this.__elements.length;
      },
      get: function (index) {
        return this.__elements[index];
      },
      getById: function (id) {
        return this.__elements[indexOfById(this.__elementIdToIndex, id)];
      },
      tryGetById: function (id) {
        var index = tryIndexOfById(this.__elementIdToIndex, id);
        return index >= 0 ? this.__elements[index] : null;
      },
      clear: function () {
        this.__elements = [];
        this.__elementIdToIndex = {};
      },
      contains: function (element) {
        var id = idOf(this.idSelector, element);
        return tryIndexOfById(this.__elementIdToIndex, id) >= 0;
      },
      containsById: function (id) {
        return tryIndexOfById(this.__elementIdToIndex, id) >= 0;
      },
      removeAll: function (elements) {
        this.removeAllById(elements.map(this.idSelector));
      },
      removeAllById: function (ids) {
        if (!ids.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.__elements;
        var elementIdToIndex = this.__elementIdToIndex;
        var indicesOffsetBy1 = ids.map(function (id) {
          return indexOfById(elementIdToIndex, id) + 1;
        });
        indicesOffsetBy1.sort(function (a, b) {
          return a - b;
        });
        this.__elements = reconstructElements(idSelector, elements, elementIdToIndex, indicesOffsetBy1, function (newArray) {
          var row = newArray.pop();
          var id = idSelector(row);
          delete elementIdToIndex[id];
        });
      },
      sortBy: function (comparator) {
        var idSelector = this.idSelector;
        var elements = this.__elements;
        var elementIdToIndex = this.__elementIdToIndex;
        this.__comparator = comparator;
        js.arrays.stableSort(elements, comparator);
        var reordered = false;
        for (var i = 0; i < elements.length; ++i) {
          var id = idSelector(elements[i]);
          reordered = reordered || elementIdToIndex[id] !== i;
          elementIdToIndex[id] = i;
        }
        return reordered;
      },
      updateAll: function (updatedElements) {
        if (this.__comparator)
          throw new Error('`updateAll` must not be called on a sorted `IndexedTable`. Use a combination of order-preserving' + ' `tryUpdateAll`, `removeAll` and `insertAll` instead.');
        if (!updatedElements.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.__elements;
        var elementIdToIndex = this.__elementIdToIndex;
        updatedElements.forEach(function (element) {
          var index = indexOfById(elementIdToIndex, idSelector(element));
          elements[index] = element;
        });
      },
      tryUpdateAll: function (updatedElements) {
        if (!this.__comparator)
          throw new Error('`tryUpdateAll` is designed for sorted `IndexedTable`s. For unsorted ones, use `updateAll` instead.');
        if (!updatedElements.length)
          return [];
        var idSelector = this.idSelector;
        var elements = this.__elements;
        var elementIdToIndex = this.__elementIdToIndex;
        var comparator = this.__comparator;
        var failed = [];
        updatedElements.forEach(function (updatedElement) {
          var index = indexOfById(elementIdToIndex, idSelector(updatedElement));
          // TODO the below check is good (quick and easy), but when it fails we should check if the
          //      updated element is still greater/less than the one before/after before failing it
          if (comparator(updatedElement, elements[index]) !== 0)
            failed.push(updatedElement);
          else
            elements[index] = updatedElement;
        });
        return failed;
      },
      addAll: function (newElements) {
        if (this.__comparator)
          throw new Error('`addAll` must not be called on an sorted `IndexedTable`. Use order-preserving `insertAll` instead.');
        if (!newElements.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.__elements;
        var elementIdToIndex = this.__elementIdToIndex;
        newElements.forEach(function (row) {
          var id = idSelector(row);
          if (js.objects.hasOwn(elementIdToIndex, id))
            throw new Error('The list already contains an element with id `' + id + '`. Did you mean to call `updateAll`?.');
          elementIdToIndex[id] = elements.push(row) - 1;
        });
      },
      insertAll: function (newElements) {
        if (!this.__comparator)
          throw new Error('`insertAll` is designed for sorted `IndexedTable`s. For unsorted ones, use `addAll` instead.');
        if (!newElements.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.__elements;
        var elementIdToIndex = this.__elementIdToIndex;
        var comparator = this.__comparator;
        js.arrays.stableSort(newElements, comparator);
        var offset = 0;
        var indices = [];
        newElements.forEach(function (newElement) {
          var insertionIndex = findInsertionIndex(elements, comparator, newElement, offset, elements.length);
          indices.push(insertionIndex);
          offset = insertionIndex;
        });
        offset = 0;
        this.__elements = reconstructElements(idSelector, elements, elementIdToIndex, indices, function (newArray) {
          var row = newElements[offset];
          var id = idSelector(row);
          var index = newArray.length;
          newArray.push(row);
          elementIdToIndex[id] = index;
          ++offset;
        });
      }
    });
    return IndexedList;
  }(onefold_js, onefold_lists);
  indexed_list = function (main) {
    return main;
  }(indexed_list_indexed_list);
  return indexed_list;
}(onefold_lists, onefold_js);
stringifyable = function (onefold_js) {
  var stringifyable_make_stringifyable, stringifyable_comparators, stringifyable_functions, stringifyable_predicates, stringifyable_stringify_replacer, stringifyable_internal, stringifyable;
  stringifyable_make_stringifyable = function (js) {
    return function makeStringifyable(stringifyable, supplier) {
      return js.objects.extend(stringifyable, {
        get 'stringifyable'() {
          return supplier();
        }
      });
    };
  }(onefold_js);
  stringifyable_comparators = function (js, makeStringifyable) {
    /**
     * @template T
     *
     * @param {function(T, T):number} comparator
     * @param {de.benshu.stringifyable.comparators.Comparator<T>=} reversed
     */
    function makeComparator(comparator, reversed) {
      return js.objects.extend(comparator, {
        get 'onResultOf'() {
          return this.onResultOf;
        },
        get 'reverse'() {
          return this.reverse;
        },
        get 'callable'() {
          return this.callable;
        }
      }, {
        get onResultOf() {
          return function (fn) {
            return byFunctionComparator(fn, comparator);
          };
        },
        get reverse() {
          return function () {
            return reversed || reverseComparator(comparator);
          };
        },
        get callable() {
          return comparator;
        }
      });
    }
    function byFunctionComparator(fn, comparator) {
      var result = function (a, b) {
        return comparator(fn(a), fn(b));
      };
      makeComparator(result);
      makeStringifyable(result, function () {
        return {
          'type': 'by-function-comparator',
          'function': fn.stringifyable,
          'comparator': comparator.stringifyable
        };
      });
      return result;
    }
    function reverseComparator(comparator) {
      var result = function (a, b) {
        return -comparator(a, b);
      };
      makeComparator(result, comparator);
      makeStringifyable(result, function () {
        return {
          'type': 'reversed-comparator',
          'comparator': comparator.stringifyable
        };
      });
      return result;
    }
    var naturalComparator = function (a, b) {
      return typeof a === 'string' && typeof b === 'string'  // TODO use Intl.Collator once safari implements internationalization.. see http://caniuse.com/#feat=internationalization
 ? a.localeCompare(b) : a <= b ? a < b ? -1 : 0 : 1;
    };
    makeComparator(naturalComparator);
    makeStringifyable(naturalComparator, function () {
      return { 'type': 'natural-comparator' };
    });
    var indifferentComparator = function (a, b) {
      return 0;
    };
    makeComparator(indifferentComparator);
    makeStringifyable(indifferentComparator, function () {
      return { 'type': 'indifferent-comparator' };
    });
    return {
      indifferent: indifferentComparator,
      natural: naturalComparator
    };
  }(onefold_js, stringifyable_make_stringifyable);
  stringifyable_functions = function (js, makeStringifyable) {
    function makeFunction(fn) {
      return js.objects.extend(fn, {
        get 'callable'() {
          return this.callable;
        }
      }, {
        get callable() {
          return fn;
        }
      });
    }
    return {
      propertyAccessor: function (propertyName) {
        var fn = function (owner) {
          return owner[propertyName];
        };
        makeFunction(fn);
        makeStringifyable(fn, function () {
          return {
            'type': 'property-accessor',
            'propertyName': propertyName
          };
        });
        return fn;
      }
    };
  }(onefold_js, stringifyable_make_stringifyable);
  stringifyable_predicates = function (js, makeStringifyable) {
    /**
     * @template T
     *
     * @param {function(T):boolean} predicate
     * @param {de.benshu.stringifyable.predicates.Predicate<T>=} negated
     */
    function makePredicate(predicate, negated) {
      return js.objects.extend(predicate, {
        get 'and'() {
          return this.and;
        },
        get 'negate'() {
          return this.negate;
        },
        get 'onResultOf'() {
          return this.onResultOf;
        },
        get 'or'() {
          return this.or;
        },
        get 'callable'() {
          return this.callable;
        }
      }, {
        get and() {
          return function (other) {
            return andPredicate([
              predicate,
              other
            ]);
          };
        },
        get negate() {
          return function () {
            return negated || negatedPredicate(predicate);
          };
        },
        get onResultOf() {
          return function (fn) {
            return byFunctionPredicate(fn, predicate);
          };
        },
        get or() {
          return function (other) {
            return orPredicate([
              predicate,
              other
            ]);
          };
        },
        get callable() {
          return predicate;
        }
      });
    }
    var alwaysFalse = function () {
      return false;
    };
    makePredicate(alwaysFalse);
    makeStringifyable(alwaysFalse, function () {
      return { 'type': 'always-false-predicate' };
    });
    var alwaysTrue = function () {
      return true;
    };
    makePredicate(alwaysTrue);
    makeStringifyable(alwaysTrue, function () {
      return { 'type': 'always-true-predicate' };
    });
    function andPredicate(components) {
      if (!components.length)
        return alwaysTrue;
      var result = function (value) {
        for (var i = 0, length = components.length; i < length; ++i)
          if (!components[i](value))
            return false;
        return true;
      };
      makePredicate(result);
      makeStringifyable(result, function () {
        return {
          'type': 'and-predicate',
          'components': components.map(function (c) {
            return c.stringifyable;
          })
        };
      });
      return result;
    }
    function byFunctionPredicate(fn, predicate) {
      var result = function (value) {
        return predicate(fn(value));
      };
      makePredicate(result);
      makeStringifyable(result, function () {
        return {
          'type': 'by-function-predicate',
          'function': fn.stringifyable,
          'predicate': predicate.stringifyable
        };
      });
      return result;
    }
    function negatedPredicate(predicate) {
      var result = function (value) {
        return !predicate(value);
      };
      makePredicate(result, predicate);
      makeStringifyable(result, function () {
        return {
          'type': 'negated-predicate',
          'predicate': predicate.stringifyable
        };
      });
      return result;
    }
    function orPredicate(components) {
      if (!components.length)
        return alwaysFalse;
      var result = function (value) {
        for (var i = 0, length = components.length; i < length; ++i)
          if (components[i](value))
            return true;
        return false;
      };
      makePredicate(result);
      makeStringifyable(result, function () {
        return {
          'type': 'or-predicate',
          'components': components.map(function (c) {
            return c.stringifyable;
          })
        };
      });
      return result;
    }
    return {
      alwaysFalse: alwaysFalse,
      alwaysTrue: alwaysTrue,
      and: andPredicate,
      from: function (predicate, supplier) {
        var p = function (v) {
          return predicate(v);
        };
        makePredicate(p);
        makeStringifyable(p, supplier);
        return p;
      },
      or: orPredicate,
      regularExpression: function (regularExpression) {
        var result = function (string) {
          return regularExpression.test(string);
        };
        makePredicate(result);
        makeStringifyable(result, function () {
          return {
            'type': 'regular-expression-predicate',
            'regularExpression': regularExpression.source,
            'caseSensitive': !regularExpression.ignoreCase,
            'multiline': regularExpression.multiline
          };
        });
        return result;
      }
    };
  }(onefold_js, stringifyable_make_stringifyable);
  stringifyable_stringify_replacer = function (key, value) {
    return typeof value === 'function' || typeof value === 'object' ? value.stringifyable || value : value;
  };
  stringifyable_internal = {
    comparators: stringifyable_comparators,
    functions: stringifyable_functions,
    predicates: stringifyable_predicates,
    //
    makeStringifyable: stringifyable_make_stringifyable,
    stringifyReplacer: stringifyable_stringify_replacer
  };
  stringifyable = function (main) {
    return main;
  }(stringifyable_internal);
  return stringifyable;
}(onefold_js);
ko_data_source = function (indexed_list, stringifyable, onefold_lists, onefold_js, knockout) {
  var ko_data_source_client_side_data_source_delta, ko_data_source_client_side_data_source_views_subviews, ko_data_source_client_side_data_source_views_abstract_view, ko_data_source_client_side_data_source_views_root_view, ko_data_source_client_side_data_source_views_filtered_view, ko_data_source_client_side_data_source_views_sorted_view, ko_data_source_client_side_data_source_views_clipped_view, ko_data_source_client_side_data_source_views_views, ko_data_source_streams_mapped_stream, ko_data_source_abstract_data_source, ko_data_source_streams_list_stream, ko_data_source_default_observable_state_transitioner, ko_data_source_observable_entries, ko_data_source_queries_query, ko_data_source_queries_limitable_query_configurator, ko_data_source_queries_offsettable_query_configurator, ko_data_source_queries_sortable_query_configurator, ko_data_source_queries_filterable_query_configurator, ko_data_source_queries_query_configurator, ko_data_source_client_side_data_source_client_side_data_source, ko_data_source_server_side_data_source_server_side_data_source, ko_data_source_streams_streams, ko_data_source_ko_data_source, ko_data_source;
  ko_data_source_client_side_data_source_delta = function () {
    function Delta(added, updated, removed) {
      this.added = added || [];
      this.updated = updated || [];
      this.removed = removed || [];
    }
    Delta.prototype = {
      get size() {
        return this.added.length + this.updated.length + this.removed.length;
      },
      get empty() {
        return !this.size;
      },
      propagateTo: function (deltas) {
        if (!this.empty)
          deltas(this);
      }
    };
    return Delta;
  }();
  ko_data_source_client_side_data_source_views_subviews = {};
  ko_data_source_client_side_data_source_views_abstract_view = function (ko, js, IndexedList, Delta, subviews) {
    function AbstractView(parent, indexedValues, deltas) {
      this._parent = parent;
      this._indexedValues = indexedValues || new IndexedList(parent._idSelector);
      this._deltas = deltas || ko.observable(new Delta());
      this._values = ko.observable(this._indexedValues.readOnly());
      this.__observablesList = null;
      this.__observables = ko.pureComputed(function () {
        this._values();
        if (!this.__observablesList)
          this.__observablesList = this._indexedValues.map(this._observableEntries.addReference);
        return this.__observablesList;
      }.bind(this));
      this.__observables.subscribe(function () {
        return this.__observablesList = null;
      }.bind(this), null, 'asleep');
    }
    AbstractView.prototype = {
      get _idSelector() {
        return this._parent._idSelector;
      },
      get _observableEntries() {
        return this._parent._observableEntries;
      },
      get values() {
        return this._values;
      },
      get observables() {
        return this.__observables;
      },
      _synchronizeObservables: function (delta) {
        if (this.__observablesList) {
          delta.added.forEach(this._observableEntries.addReference);
          this.__observablesList = this._indexedValues.map(this._observableEntries.lookup);
          delta.removed.forEach(this._observableEntries.releaseReference);
        }
        this._values.valueHasMutated();
      },
      _releaseObservableReferences: function () {
        if (this.__observables)
          this._indexedValues.forEach(this._observableEntries.releaseReference);
      },
      forceUpdateIfNecessary: function () {
        this._parent.forceUpdateIfNecessary();
        this._forceUpdateIfNecessary();
      },
      filteredBy: function (predicate) {
        return new subviews.FilteredView(this, predicate);
      },
      sortedBy: function (comparator) {
        return new subviews.SortedView(this, comparator);
      },
      clipped: function (offset, size) {
        return new subviews.ClippedView(this, offset, size);
      }
    };
    return AbstractView;
  }(knockout, onefold_js, indexed_list, ko_data_source_client_side_data_source_delta, ko_data_source_client_side_data_source_views_subviews);
  ko_data_source_client_side_data_source_views_root_view = function (ko, js, AbstractView) {
    function RootView(idSelector, observableEntries, values, deltas) {
      AbstractView.call(this, {
        _idSelector: idSelector,
        _observableEntries: observableEntries
      }, values, deltas);
      this.__deltaSubscription = deltas.subscribe(function (delta) {
        this._synchronizeObservables(delta);
      }.bind(this));
    }
    RootView.prototype = js.objects.extend({}, AbstractView.prototype, {
      forceUpdateIfNecessary: function () {
      },
      dispose: function () {
        this.__deltaSubscription.dispose();
        this._releaseObservableReferences();
      }
    });
    return RootView;
  }(knockout, onefold_js, ko_data_source_client_side_data_source_views_abstract_view);
  ko_data_source_client_side_data_source_views_filtered_view = function (ko, js, Delta, AbstractView, subviews) {
    function filterDelta(idSelector, indexedValues, delta, predicate) {
      var added = delta.added.filter(predicate);
      var updated = [];
      var deleted = delta.removed.filter(predicate);
      for (var i = 0, j = delta.updated.length; i < j; i++) {
        var entry = delta.updated[i];
        var contained = indexedValues.containsById(idSelector(entry));
        if (predicate(entry))
          if (contained)
            updated.push(entry);
          else
            added.push(entry);
        else if (contained)
          deleted.push(entry);
      }
      return new Delta(added, updated, deleted);
    }
    function FilteredView(parent, predicate) {
      AbstractView.call(this, parent);
      var privateRecomputeTrigger = ko.observable(ko.unwrap(predicate));
      this._forceUpdateIfNecessary = function () {
        return privateRecomputeTrigger(ko.unwrap(predicate));
      };
      this.__computer = ko.computed(function () {
        privateRecomputeTrigger();
        var p = ko.unwrap(predicate);
        privateRecomputeTrigger(p);
        var oldValues = this._indexedValues.toArray();
        var newValues = this._parent._indexedValues.filter(p).toArray();
        var delta = new Delta(newValues, [], oldValues);
        this._indexedValues.clear();
        this._indexedValues.addAll(newValues);
        this._synchronizeObservables(delta);
        delta.propagateTo(this._deltas);
      }.bind(this));
      this.__deltaSubscription = parent._deltas.subscribe(function (delta) {
        var filtered = filterDelta(this._idSelector, this._indexedValues, delta, ko.unwrap(predicate));
        if (filtered.empty)
          return;
        this._indexedValues.removeAll(filtered.removed);
        this._indexedValues.updateAll(filtered.updated);
        this._indexedValues.addAll(filtered.added);
        this._synchronizeObservables(delta);
        filtered.propagateTo(this._deltas);
      }.bind(this));
    }
    FilteredView.prototype = js.objects.extend({}, AbstractView.prototype, {
      dispose: function () {
        this.__computer.dispose();
        this.__deltaSubscription.dispose();
        this._releaseObservableReferences();
      }
    });
    subviews.FilteredView = FilteredView;
    return FilteredView;
  }(knockout, onefold_js, ko_data_source_client_side_data_source_delta, ko_data_source_client_side_data_source_views_abstract_view, ko_data_source_client_side_data_source_views_subviews);
  ko_data_source_client_side_data_source_views_sorted_view = function (ko, js, AbstractView, subviews) {
    function SortedView(parent, comparator) {
      AbstractView.call(this, parent);
      this._indexedValues.addAll(parent._indexedValues.toArray());
      var privateRecomputeTrigger = ko.observable(ko.unwrap(comparator));
      this._forceUpdateIfNecessary = function () {
        return privateRecomputeTrigger(ko.unwrap(comparator));
      };
      this.__computer = ko.computed(function () {
        privateRecomputeTrigger();
        var c = ko.unwrap(comparator);
        privateRecomputeTrigger(c);
        if (this._indexedValues.sortBy(c))
          this._deltas.valueHasMutated();
      }.bind(this));
      this.__deltaSubscription = parent._deltas.subscribe(function (delta) {
        var failedUpdates = this._indexedValues.tryUpdateAll(delta.updated);
        this._indexedValues.removeAll(delta.removed.concat(failedUpdates));
        this._indexedValues.insertAll(delta.added.concat(failedUpdates));
        this._synchronizeObservables(delta);
        this._deltas.valueHasMutated();
      }.bind(this));
    }
    SortedView.prototype = js.objects.extend({}, AbstractView.prototype, {
      filteredBy: function () {
        throw new Error('Filtering a sorted view is not supported.');
      },
      sortedBy: function () {
        throw new Error('Sorting a sorted view is not supported.');
      },
      dispose: function () {
        this.__computer.dispose();
        this.__deltaSubscription.dispose();
        this._releaseObservableReferences();
      }
    });
    subviews.SortedView = SortedView;
    return SortedView;
  }(knockout, onefold_js, ko_data_source_client_side_data_source_views_abstract_view, ko_data_source_client_side_data_source_views_subviews);
  ko_data_source_client_side_data_source_views_clipped_view = function (ko, js, lists, subviews) {
    function checkForChanges(idSelector, oldValues, newValues) {
      if (oldValues.length !== newValues.length)
        return true;
      for (var i = oldValues.length - 1; i >= 0; --i) {
        if (idSelector(oldValues.get(i)) !== idSelector(newValues.get(i)))
          return true;
      }
      return false;
    }
    // TODO rename AbstractView AbstractIndexedView and extract an AbstractView from it to inherit from
    function ClippedView(parent, offset, limit) {
      var observableEntries = parent._observableEntries;
      this.__parent = parent;
      this.__values = ko.observable(lists.newArrayList());
      this.__observables = null;
      var idSelector = parent._idSelector;
      var unwrapArguments = function () {
        return {
          offset: ko.unwrap(offset),
          limit: ko.unwrap(limit)
        };
      };
      var privateRecomputeTrigger = ko.observable(unwrapArguments());
      this._forceUpdateIfNecessary = function () {
        var lastArguments = privateRecomputeTrigger();
        var newArguments = unwrapArguments();
        if (lastArguments.offset !== newArguments.offset || lastArguments.limit !== newArguments.limit)
          privateRecomputeTrigger(newArguments);
      };
      this.__computer = ko.computed(function () {
        // the delta isn't worth much to clipping, so we reuse the __computer
        parent._deltas();
        privateRecomputeTrigger();
        var args = unwrapArguments();
        privateRecomputeTrigger(args);
        var unclipped = parent._indexedValues;
        var from = Math.min(unclipped.length, args.offset);
        var to = Math.min(unclipped.length, from + args.limit);
        var oldValues = this.__values.peek();
        var newValues = unclipped.slice(from, to);
        if (checkForChanges(idSelector, oldValues, newValues)) {
          this.__values(newValues);
          if (this.__observables) {
            this.__observables(this.__values.peek().map(observableEntries.addReference));
            oldValues.forEach(observableEntries.releaseReference);
          }
        }
      }.bind(this));
    }
    ClippedView.prototype = {
      get values() {
        return this.__values;
      },
      get observables() {
        if (!this.__observables)
          this.__observables = ko.observable(this.values().map(this.__parent._observableEntries.addReference));
        return this.__observables;
      },
      forceUpdateIfNecessary: function () {
        this.__parent.forceUpdateIfNecessary();
        this._forceUpdateIfNecessary();
      },
      filteredBy: function () {
        throw new Error('Filtering a clipped view is not supported.');
      },
      sortedBy: function () {
        throw new Error('Sorting a clipped view is not supported.');
      },
      clipped: function () {
        throw new Error('Clipping a clipped view is not supported.');
      },
      dispose: function () {
        this.__computer.dispose();
        if (this.__observables)
          this.__values().forEach(this.__parent._observableEntries.releaseReference);
      }
    };
    subviews.ClippedView = ClippedView;
    return ClippedView;
  }(knockout, onefold_js, onefold_lists, ko_data_source_client_side_data_source_views_subviews);
  ko_data_source_client_side_data_source_views_views = function (RootView) {
    return { RootView: RootView };
  }(ko_data_source_client_side_data_source_views_root_view);
  ko_data_source_streams_mapped_stream = function (js) {
    /**
     * @constructor
     * @template D, I
     * @extends {de.benshu.ko.dataSource.streams.Stream<I>}
     *
     * @param {!de.benshu.ko.dataSource.streams.Stream<D>} sourceStream
     * @param {function(D):I} mapper
     * @param {function(I)=} closer
     */
    function MappedStream(sourceStream, mapper, closer) {
      this.__sourceStream = sourceStream;
      this.__evaluator = closer ? function (action, sourceElement) {
        var resource = mapper(sourceElement);
        try {
          return action(resource);
        } finally {
          closer(resource);
        }
      } : function (action, sourceElement) {
        return action(mapper(sourceElement));
      };
    }
    MappedStream.prototype = {
      forEach: function (action) {
        this.__sourceStream.forEach(this.__evaluator.bind(null, action));
      },
      map: function (mapper) {
        return new MappedStream(this, mapper);
      },
      reduce: function (accumulator, identity) {
        return this.__sourceStream.reduce(function (a, b) {
          return accumulator(a, this.__evaluator(function (x) {
            return x;
          }, b));
        }.bind(this), identity);
      }
    };
    var proto = MappedStream.prototype;
    js.objects.extend(proto, {
      'forEach': proto.forEach,
      'map': proto.map,
      'reduce': proto.reduce
    });
    return MappedStream;
  }(onefold_js);
  ko_data_source_abstract_data_source = function (ko, js, MappedResource) {
    /**
     * @constructor
     * @template I, V, O
     * @extends {de.benshu.ko.dataSource.DataSource<I, V, O>}
     *
     * @param {!de.benshu.ko.dataSource.ObservableEntries<I, V, O>} observableEntries
     * @param {!function(I):V} getValueById
     */
    function AbstractDataSource(observableEntries, getValueById) {
      this.__observableEntries = observableEntries;
      this.__getValueById = getValueById;
    }
    AbstractDataSource.prototype = {
      openEntryView: function (entryId) {
        return new DefaultEntryView(this.openOptionalEntryView(entryId));
      },
      openOptionalEntryView: function (entryId) {
        return new DefaultOptionalEntryView(this.__observableEntries, this.__getValueById, entryId);
      },
      streamObservables: function (queryConfiguration) {
        return this.streamValues(queryConfiguration).then(function (values) {
          return new MappedResource(values, this.__observableEntries.addReference.bind(this.__observableEntries), this.__observableEntries.releaseReference.bind(this.__observableEntries));
        }.bind(this));
      },
      openView: function () {
        throw new Error('`' + this.constructor + '` does not implement `openView`.');
      },
      streamValues: function () {
        throw new Error('`' + this.constructor + '` does not implement `streamValues`.');
      },
      dispose: function () {
        throw new Error('`' + this.constructor + '` does not implement `dispose`.');
      }
    };
    AbstractDataSource.prototype = js.objects.extend({}, {
      'openEntryView': AbstractDataSource.prototype.openEntryView,
      'openOptionalEntryView': AbstractDataSource.prototype.openOptionalEntryView,
      'streamObservables': AbstractDataSource.prototype.streamObservables
    }, AbstractDataSource.prototype);
    /**
     * @constructor
     * @template V, O
     * @extends {de.benshu.ko.dataSource.EntryView<V, O>}
     *
     * @param {de.benshu.ko.dataSource.OptionalEntryView<V, O>} optionalEntryView
     */
    function DefaultEntryView(optionalEntryView) {
      this.__optionalEntryView = optionalEntryView;
      this.__subscription = null;
    }
    DefaultEntryView.prototype = {
      get value() {
        return this.__optionalEntryView.value;
      },
      get observable() {
        if (!this.__subscription) {
          this.__subscription = this.__optionalEntryView.optionalObservable.subscribe(function () {
            throw new Error('Illegal state: A non-optional view for this entry is still open.');
          });
        }
        return this.__optionalEntryView.observable;
      },
      dispose: function () {
        if (this.__subscription)
          this.__subscription.dispose();
        this.__optionalEntryView.dispose();
      }
    };
    DefaultEntryView.prototype = js.objects.extend({}, {
      get 'value'() {
        return this.value;
      },
      get 'observable'() {
        return this.observable;
      },
      'dispose': DefaultEntryView.prototype.dispose
    }, DefaultEntryView.prototype);
    /**
     * @constructor
     * @template I, V, O
     * @extends {de.benshu.ko.dataSource.OptionalEntryView<V, O>}
     *
     * @param {de.benshu.ko.dataSource.ObservableEntries<I, V, O>} observableEntries
     * @param {function(V):I} getValueById
     * @param {I} entryId
     */
    function DefaultOptionalEntryView(observableEntries, getValueById, entryId) {
      this.__observableEntries = observableEntries;
      this.__getValueById = getValueById;
      this.__entryId = entryId;
      this.__disposed = false;
      this.__lastKnownValue = null;
      this.__observable = null;
      this.__optionalObservable = null;
      this.__subscription = null;
    }
    DefaultOptionalEntryView.prototype = {
      __assertNotDisposed: function () {
        if (this.__disposed)
          throw new Error('Illegal state: Entry view was already disposed.');
      },
      get value() {
        this.__assertNotDisposed();
        return this.__lastKnownValue = this.__getValueById(this.__entryId);
      },
      get observable() {
        this.__assertNotDisposed();
        return (this.__observable || this.optionalObservable) && this.__observable;
      },
      get optionalObservable() {
        this.__assertNotDisposed();
        if (this.__optionalObservable)
          return this.__optionalObservable;
        var sharedObservable = this.__observableEntries.addOptionalReference(this.value);
        this.__observable = sharedObservable();
        this.__optionalObservable = ko.observable({
          'present': true,
          'observable': this.__observable
        });
        this.__subscription = sharedObservable.subscribe(function (observable) {
          this.__optionalObservable({
            'present': !!observable,
            'observable': observable
          });
        }.bind(this));
        return this.__optionalObservable;
      },
      dispose: function () {
        this.__assertNotDisposed();
        this.__disposed = true;
        if (this.__subscription) {
          this.__subscription.dispose();
          this.__observableEntries.releaseReference(this.__lastKnownValue);
          this.__lastKnownValue = this.__observable = this.__optionalObservable = this.__subscription = null;
        }
      }
    };
    DefaultOptionalEntryView.prototype = js.objects.extend({}, {
      get 'value'() {
        return this.value;
      },
      get 'observable'() {
        return this.observable;
      },
      get 'optionalObservable'() {
        return this.optionalObservable;
      },
      'dispose': DefaultOptionalEntryView.prototype.dispose
    }, DefaultOptionalEntryView.prototype);
    var TRUE = function () {
      return true;
    };
    var ZERO = function () {
      return 0;
    };
    /**
     * @constructor
     * @template V
     *
     * @param {(function(V):boolean|ko.Subscribable<function(V):boolean>)=} predicate
     * @param {(function(V, V):number|ko.Subscribable<function(V, V):number>)=} comparator
     * @param {(number|ko.Subscribable<number>)=} offset
     * @param {(number|ko.Subscribable<number>)=} limit
     */
    function OpenViewKey(predicate, comparator, offset, limit) {
      this.predicate = predicate || TRUE;
      this.comparator = comparator || ZERO;
      this.offset = offset || 0;
      this.limit = limit || limit === 0 ? limit : Number.POSITIVE_INFINITY;
      this.rank = Math.max(this.predicate === TRUE ? OpenViewKey.RANK_ROOT : OpenViewKey.RANK_FILTERED, this.comparator === ZERO ? OpenViewKey.RANK_ROOT : OpenViewKey.RANK_SORTED, this.offset === 0 && this.limit === Number.POSITIVE_INFINITY ? OpenViewKey.RANK_ROOT : OpenViewKey.RANK_CLIPPED);
    }
    OpenViewKey.RANK_ROOT = 0;
    OpenViewKey.RANK_FILTERED = 1;
    OpenViewKey.RANK_SORTED = 2;
    OpenViewKey.RANK_CLIPPED = 3;
    OpenViewKey.fromQuery = function (query) {
      return new OpenViewKey(query.predicate, query.comparator, query.offset, query.limit);
    };
    OpenViewKey.prototype = {
      equals: function (other) {
        return this.rank === other.rank && this.predicate === other.predicate && this.comparator === other.comparator && this.offset === other.offset && this.limit === other.limit;
      },
      reduceRank: function () {
        if (this.rank <= 0)
          throw new Error('Unsupported operation.');
        var args = [
          null,
          this.predicate,
          this.comparator
        ].slice(0, this.rank);
        /** @type {function(new:OpenViewKey<V>)} */
        var ReducedRankKeyConstructor = OpenViewKey.bind.apply(OpenViewKey, args);
        return new ReducedRankKeyConstructor();
      },
      allRanks: function () {
        return this.rank === 0 ? [this] : this.reduceRank().allRanks().concat([this]);
      },
      applyPrimaryTransformation: function (view) {
        var accessor = [
          function (v) {
            return v.filteredBy;
          },
          function (v) {
            return v.sortedBy;
          },
          function (v) {
            return v.clipped;
          }
        ][this.rank - 1];
        var args = [
          [this.predicate],
          [this.comparator],
          [
            this.offset,
            this.limit
          ]
        ][this.rank - 1];
        return accessor(view).apply(view, args);
      }
    };
    /**
     * @constructor
     *
     * @param key
     * @param view
     * @param disposer
     */
    function OpenViewReference(key, view, disposer) {
      this.key = key;
      this.view = view;
      this.referenceCount = 1;
      this.disposer = disposer;
    }
    OpenViewReference.prototype = {
      addReference: function () {
        if (this.referenceCount <= 0)
          throw new Error('Assertion error: Reference count at `' + this.referenceCount + '`.');
        ++this.referenceCount;
        return this;
      },
      releaseReference: function () {
        if (--this.referenceCount === 0) {
          this.disposer();
        }
        return this;
      }
    };
    AbstractDataSource.OpenViewKey = OpenViewKey;
    AbstractDataSource.OpenViewReference = OpenViewReference;
    return AbstractDataSource;
  }(knockout, onefold_js, ko_data_source_streams_mapped_stream);
  ko_data_source_streams_list_stream = function (js, MappedStream) {
    /**
     * @constructor
     * @template T
     * @extends {de.benshu.ko.dataSource.streams.Stream<T>}
     */
    function ListStream(list) {
      this.__list = list;
    }
    ListStream.prototype = {
      forEach: function (action) {
        // TODO prevent blocking
        this.__list.forEach(action);
      },
      map: function (mapper) {
        return new MappedStream(this, mapper);
      },
      reduce: function (accumulator, identity) {
        // TODO prevent blocking
        return Promise.resolve(this.__list.reduce(accumulator, identity));
      }
    };
    var proto = ListStream.prototype;
    js.objects.extend(proto, {
      'forEach': proto.forEach,
      'map': proto.map,
      'reduce': proto.reduce
    });
    return ListStream;
  }(onefold_js, ko_data_source_streams_mapped_stream);
  ko_data_source_default_observable_state_transitioner = function (ko) {
    function DefaultObservableStateTransitioner(options) {
      this.__isObservableProperty = false;
      (options && options['observableProperties'] || []).forEach(function (p) {
        this.__isObservableProperty = this.__isObservableProperty || {};
        this.__isObservableProperty[p] = true;
      }.bind(this));
    }
    DefaultObservableStateTransitioner.prototype = {
      'constructor': function (entry) {
        var isObservableProperty = this.__isObservableProperty;
        if (!isObservableProperty)
          return entry;
        var observable = {};
        Object.keys(entry).forEach(function (p) {
          if (isObservableProperty && isObservableProperty[p])
            observable[p] = ko.observable(entry[p]);
          else
            observable[p] = entry[p];
        });
        return observable;
      },
      'updater': function (observable, updatedEntry) {
        var isObservableProperty = this.__isObservableProperty;
        if (!isObservableProperty)
          return observable;
        Object.keys(updatedEntry).filter(function (p) {
          return isObservableProperty && isObservableProperty[p];
        }).forEach(function (p) {
          return observable[p](updatedEntry[p]);
        });
        return observable;
      },
      'destructor': function () {
      }
    };
    return DefaultObservableStateTransitioner;
  }(knockout);
  ko_data_source_observable_entries = function (ko, js, DefaultObservableStateTransitioner) {
    /** @constructor */
    function ObservableEntry(observable) {
      this.observable = observable;
      this.optionalObservable = ko.observable(observable);
      this.refcount = 1;
    }
    // TODO clean up extract prototype
    return function ObservableEntries(idSelector, observableStateTransitioner) {
      observableStateTransitioner = observableStateTransitioner || new DefaultObservableStateTransitioner();
      var hashtable = {};
      var newInvalidIdTypeError = function (id) {
        throw new Error('Illegal argument: Ids must be strings (\'' + id + '\' is of type \'' + typeof id + '\').');
      };
      this.addReference = function (value) {
        return addAnyReference(value).observable;
      };
      this.addOptionalReference = function (value) {
        return addAnyReference(value).optionalObservable;
      };
      var addAnyReference = function (value) {
        var id = idSelector(value);
        if (typeof id !== 'string')
          throw newInvalidIdTypeError(id);
        return Object.prototype.hasOwnProperty.call(hashtable, id) ? addReferenceToExistingEntry(id) : addEntry(id, value);
      };
      var addReferenceToExistingEntry = function (id) {
        var entry = hashtable[id];
        ++entry.refcount;
        return entry;
      };
      var addEntry = function (id, value) {
        var entry = new ObservableEntry(observableStateTransitioner['constructor'](value));
        hashtable[id] = entry;
        return entry;
      };
      this.releaseReference = function (value) {
        var id = idSelector(value);
        var entry = lookupEntry(id);
        if (--entry.refcount === 0) {
          destroy(entry);
          delete hashtable[id];
        }
      };
      this.lookup = function (value) {
        return lookupEntry(idSelector(value)).observable;
      };
      this.reconstructEntries = function (addedEntries) {
        addedEntries.forEach(function (addedEntry) {
          var id = idSelector(addedEntry);
          if (js.objects.hasOwn(hashtable, id)) {
            var entry = hashtable[id];
            if (!entry.observable) {
              entry.observable = observableStateTransitioner['constructor'](addedEntry);
              entry.optionalObservable(entry.observable);
            }
          }
        });
      };
      this.updateEntries = function (updatedEntries) {
        updatedEntries.forEach(function (updatedEntry) {
          var id = idSelector(updatedEntry);
          if (js.objects.hasOwn(hashtable, id)) {
            var entry = hashtable[id];
            observableStateTransitioner['updater'](entry.observable, updatedEntry);
          }
        });
      };
      this.reconstructUpdateOrDestroyAll = function (updatedValueSupplier) {
        js.objects.forEachProperty(hashtable, function (id, entry) {
          var updatedValue = updatedValueSupplier(id);
          if (updatedValue) {
            if (entry.observable) {
              observableStateTransitioner['updater'](entry.observable, updatedValue);
            } else {
              entry.observable = observableStateTransitioner['constructor'](updatedValue);
              entry.optionalObservable(entry.observable);
            }
          } else {
            destroy(entry);
          }
        });
      };
      this.destroyAll = function (idPredicate) {
        js.objects.forEachProperty(hashtable, function (id, entry) {
          if (idPredicate(id))
            destroy(entry);
        });
      };
      function destroy(entry) {
        var observable = entry.observable;
        entry.optionalObservable(null);
        entry.observable = null;
        observableStateTransitioner['destructor'](observable);
      }
      this.dispose = function () {
        this.destroyAll(function () {
          return true;
        });
      }.bind(this);
      var lookupEntry = function (id) {
        if (typeof id !== 'string')
          throw newInvalidIdTypeError(id);
        if (js.objects.hasOwn(hashtable, id))
          return hashtable[id];
        else
          throw new Error('No entry for id `' + id + '`.');
      };
    };
  }(knockout, onefold_js, ko_data_source_default_observable_state_transitioner);
  ko_data_source_queries_query = function (ko, js, stringifyable) {
    /**
     * @constructor
     * @extends {de.benshu.ko.dataSource.Query}
     */
    function Query(predicate, comparator, offset, limit) {
      this.__predicate = predicate;
      this.__comparator = comparator;
      this.__offset = offset;
      this.__limit = limit;
    }
    Query.prototype = js.objects.extend({
      get 'predicate'() {
        return this.predicate;
      },
      get 'comparator'() {
        return this.comparator;
      },
      get 'offset'() {
        return this.offset;
      },
      get 'limit'() {
        return this.limit;
      }
    }, {
      get predicate() {
        return this.__predicate;
      },
      get comparator() {
        return this.__comparator;
      },
      get offset() {
        return this.__offset;
      },
      get limit() {
        return this.__limit;
      },
      normalize: function () {
        return new Query(this.predicate || stringifyable.predicates.alwaysTrue, this.comparator || stringifyable.comparators.indifferent, this.offset || 0, this.limit || this.limit === 0 ? this.limit : Number.POSITIVE_INFINITY);
      },
      unwrapArguments: function () {
        return new Query(ko.unwrap(this.predicate), ko.unwrap(this.comparator), ko.unwrap(this.offset), ko.unwrap(this.limit));
      },
      equals: function (other) {
        return this.predicate === other.predicate && this.comparator === other.comparator && this.offset === other.offset && this.limit === other.limit;
      }
    });
    return Query;
  }(knockout, onefold_js, stringifyable);
  ko_data_source_queries_limitable_query_configurator = function (js, Query) {
    function LimitableQueryConfigurator(predicate, comparator, offset) {
      Query.call(this, predicate, comparator, offset);
    }
    var proto = {
      limitedTo: function (limit) {
        return new Query(this.predicate, this.comparator, this.offset, limit);
      }
    };
    LimitableQueryConfigurator.prototype = js.objects.extend({}, Query.prototype, proto, { 'limitedTo': proto.limitedTo });
    return LimitableQueryConfigurator;
  }(onefold_js, ko_data_source_queries_query);
  ko_data_source_queries_offsettable_query_configurator = function (js, LimitableQueryConfigurator) {
    function OffsettableQueryConfigurator(predicate, comparator) {
      LimitableQueryConfigurator.call(this, predicate, comparator);
    }
    var proto = {
      offsetBy: function (offset) {
        return new LimitableQueryConfigurator(this.predicate, this.comparator, offset);
      }
    };
    OffsettableQueryConfigurator.prototype = js.objects.extend({}, LimitableQueryConfigurator.prototype, proto, { 'offsetBy': proto.offsetBy });
    return OffsettableQueryConfigurator;
  }(onefold_js, ko_data_source_queries_limitable_query_configurator);
  ko_data_source_queries_sortable_query_configurator = function (js, OffsettableQueryConfigurator) {
    function SortableQueryConfigurator(predicate) {
      OffsettableQueryConfigurator.call(this, predicate);
    }
    var proto = {
      sortedBy: function (comparator) {
        return new OffsettableQueryConfigurator(this.predicate, comparator);
      }
    };
    SortableQueryConfigurator.prototype = js.objects.extend({}, OffsettableQueryConfigurator.prototype, proto, { 'sortedBy': proto.sortedBy });
    return SortableQueryConfigurator;
  }(onefold_js, ko_data_source_queries_offsettable_query_configurator);
  ko_data_source_queries_filterable_query_configurator = function (js, SortableQueryConfigurator) {
    function FilterableQueryConfigurator() {
      SortableQueryConfigurator.call(this);
    }
    var proto = {
      filteredBy: function (predicate) {
        return new SortableQueryConfigurator(predicate);
      }
    };
    FilterableQueryConfigurator.prototype = js.objects.extend({}, SortableQueryConfigurator.prototype, proto, { 'filteredBy': proto.filteredBy });
    return FilterableQueryConfigurator;
  }(onefold_js, ko_data_source_queries_sortable_query_configurator);
  ko_data_source_queries_query_configurator = function (js, FilterableQueryConfigurator) {
    /**
     * @constructor
     */
    function QueryConfiguratorImpl() {
      FilterableQueryConfigurator.call(this);
    }
    QueryConfiguratorImpl.prototype = js.objects.extend({}, FilterableQueryConfigurator.prototype);
    return QueryConfiguratorImpl;
  }(onefold_js, ko_data_source_queries_filterable_query_configurator);
  ko_data_source_client_side_data_source_client_side_data_source = function (require) {
    var ko = knockout, js = onefold_js,
      //
      views = ko_data_source_client_side_data_source_views_views,
      //
      AbstractDataSource = ko_data_source_abstract_data_source, Delta = ko_data_source_client_side_data_source_delta, IndexedList = indexed_list, ListStream = ko_data_source_streams_list_stream, ObservableEntries = ko_data_source_observable_entries, QueryConfigurator = ko_data_source_queries_query_configurator;
    /**
     * @constructor
     * @template I, V, O
     * @extends {AbstractDataSource<I, V, O>}
     */
    function ClientSideDataSource(idSelector, observableEntries) {
      observableEntries = observableEntries || new ObservableEntries(idSelector);
      var values = new IndexedList(idSelector);
      AbstractDataSource.call(this, observableEntries, function (entryId) {
        return values.getById(entryId);
      });
      this.__idSelector = idSelector;
      this.__observableEntries = observableEntries;
      this.__values = values;
      this.__deltas = ko.observable(new Delta());
      this.__openViewReferences = [];
      var rootView = new views.RootView(this.__idSelector, this.__observableEntries, this.__values, this.__deltas);
      this.__rootView = this.__addOpenViewReference(new AbstractDataSource.OpenViewKey(), rootView);
      this.__size = ko.pureComputed(function () {
        return rootView.values().length;
      });
    }
    ClientSideDataSource.prototype = {
      get size() {
        return this.__size;
      },
      __addOpenViewReference: function (key, view) {
        var ref = new AbstractDataSource.OpenViewReference(key, view, function () {
          return this.__openViewReferences.splice(this.__openViewReferences.indexOf(ref), 1);
        }.bind(this));
        this.__openViewReferences.push(ref);
        return ref;
      },
      __increaseReferenceCountOrOpenNewView: function (key) {
        var existing = js.arrays.singleOrNull(this.__openViewReferences, function (v) {
          return key.equals(v.key);
        });
        if (existing)
          return existing.addReference();
        else {
          var parentKey = key.reduceRank();
          var parentView = js.arrays.single(this.__openViewReferences, function (v) {
            return parentKey.equals(v.key);
          }).view;
          var view = key.applyPrimaryTransformation(parentView);
          return this.__addOpenViewReference(key, view);
        }
      },
      addEntries: function (newEntries) {
        this.__values.addAll(newEntries);
        new Delta(newEntries).propagateTo(this.__deltas);
        this.__observableEntries.reconstructEntries(newEntries);
      },
      addOrUpdateEntries: function (entries) {
        var added = [], updated = [];
        entries.forEach(function (entry) {
          return (this.__values.contains(entry) ? updated : added).push(entry);
        }.bind(this));
        this.__values.addAll(added);
        this.__values.updateAll(updated);
        new Delta(added, updated).propagateTo(this.__deltas);
        this.__observableEntries.reconstructEntries(added);
        this.__observableEntries.updateEntries(updated);
      },
      openView: function (queryConfiguration) {
        var query = (queryConfiguration || function (x) {
          return x;
        })(new QueryConfigurator());
        var key = AbstractDataSource.OpenViewKey.fromQuery(query);
        var internalViewRefs = key.allRanks().map(function (k) {
          return this.__increaseReferenceCountOrOpenNewView(k);
        }.bind(this));
        var internalView = internalViewRefs[internalViewRefs.length - 1].view;
        internalView.forceUpdateIfNecessary();
        return new InternalViewAdapter(internalView, internalViewRefs);
      },
      removeEntries: function (entries) {
        this.__values.removeAll(entries);
        new Delta([], [], entries).propagateTo(this.__deltas);
        this.__observableEntries.destroyAll(function (id) {
          return !this.__values.containsById(id);
        }.bind(this));
      },
      replaceEntries: function (newEntries) {
        var removedEntries = this.__values.toArray();
        this.__values.clear();
        this.__values.addAll(newEntries);
        new Delta(newEntries, [], removedEntries).propagateTo(this.__deltas);
        this.__observableEntries.reconstructUpdateOrDestroyAll(function (id) {
          return this.__values.tryGetById(id);
        }.bind(this));
      },
      streamValues: function (queryConfiguration) {
        var view = this.openView(queryConfiguration);
        try {
          return Promise.resolve(new ListStream(view.values.peek().slice()));
        } finally {
          view.dispose();
        }
      },
      updateEntries: function (updatedEntries) {
        this.__values.updateAll(updatedEntries);
        new Delta([], updatedEntries).propagateTo(this.__deltas);
        this.__observableEntries.updateEntries(updatedEntries);
      },
      dispose: function () {
        this.__rootView.releaseReference();
        this.__observableEntries.dispose();
        if (this.__openViewReferences.length) {
          var views = this.__openViewReferences.length;
          var referenceCount = this.__openViewReferences.reduce(function (c, r) {
            return c + r.referenceCount;
          }, 0);
          window.console.warn('Some views were not or are not yet disposed (' + views + ' views, ' + referenceCount + ' references).');
        }
      }
    };
    ClientSideDataSource.prototype = js.objects.extend({}, AbstractDataSource.prototype, {
      get 'size'() {
        return this.size;
      },
      'addEntries': ClientSideDataSource.prototype.addEntries,
      'dispose': ClientSideDataSource.prototype.dispose,
      'addOrUpdateEntries': ClientSideDataSource.prototype.addOrUpdateEntries,
      'openView': ClientSideDataSource.prototype.openView,
      'removeEntries': ClientSideDataSource.prototype.removeEntries,
      'replaceEntries': ClientSideDataSource.prototype.replaceEntries,
      'streamValues': ClientSideDataSource.prototype.streamValues,
      'updateEntries': ClientSideDataSource.prototype.updateEntries
    }, ClientSideDataSource.prototype);
    var NO_DIRTY = ko.pureComputed(function () {
      return false;
    });
    /**
     * @constructor
     * @template V, O
     * @extends {de.benshu.ko.dataSource.View<V, O>}
     *
     * @param internalView
     * @param internalViewRefs
     */
    function InternalViewAdapter(internalView, internalViewRefs) {
      this.__internalView = internalView;
      this.__internalViewRefs = internalViewRefs;
      this.__size = ko.pureComputed(function () {
        return internalView.values().length;
      });
      this.__filteredSize = ko.pureComputed(function () {
        var filteredRef = js.arrays.singleOrNull(internalViewRefs, function (r) {
          return r.key.rank === AbstractDataSource.OpenViewKey.RANK_FILTERED;
        }) || internalViewRefs[0];
        return filteredRef.view.values().length;
      });
    }
    InternalViewAdapter.prototype = {
      get dirty() {
        return NO_DIRTY;
      },
      get filteredSize() {
        return this.__filteredSize;
      },
      get metadata() {
        return ko.pureComputed(function () {
          return {};
        });
      },
      get observables() {
        return this.__internalView.observables;
      },
      get size() {
        return this.__size;
      },
      get values() {
        return this.__internalView.values;
      },
      dispose: function () {
        this.__internalViewRefs.forEach(function (r) {
          r.releaseReference();
        });
      }
    };
    InternalViewAdapter.prototype = js.objects.extend({
      get 'dirty'() {
        return this.dirty;
      },
      get 'filteredSize'() {
        return this.filteredSize;
      },
      get 'metadata'() {
        return this.metadata;
      },
      get 'observables'() {
        return this.observables;
      },
      get 'size'() {
        return this.size;
      },
      get 'values'() {
        return this.values;
      },
      'dispose': InternalViewAdapter.prototype.dispose
    }, InternalViewAdapter.prototype);
    return ClientSideDataSource;
  }({});
  ko_data_source_server_side_data_source_server_side_data_source = function (require) {
    var ko = knockout, js = onefold_js, lists = onefold_lists,
      //
      AbstractDataSource = ko_data_source_abstract_data_source, ObservableEntries = ko_data_source_observable_entries, QueryConfigurator = ko_data_source_queries_query_configurator;
    var hasOwn = js.objects.hasOwn;
    /**
     * @constructor
     * @template I, V, O
     * @extends {AbstractDataSource<I, V, O>}
     */
    function ServerSideDataSource(idSelector, querier, observableEntries) {
      observableEntries = observableEntries || new ObservableEntries(idSelector);
      var values = {};
      AbstractDataSource.call(this, observableEntries, function (entryId) {
        if (!hasOwn(values, entryId))
          throw new Error('No known entry with id `' + entryId + '`.');
        return values[entryId].value;
      });
      this.__idSelector = idSelector;
      this.__observableEntries = observableEntries;
      this.__querier = querier;
      this.__values = values;
      this.__size = ko.observable(0);
      this.__computedSize = ko.pureComputed(function () {
        return this.__size();
      }.bind(this));
      this.__openViewReferences = [];
    }
    ServerSideDataSource.prototype = {
      get size() {
        return this.__computedSize;
      },
      __addValueReference: function (value) {
        var id = this.__idSelector(value);
        if (hasOwn(this.__values, id)) {
          var ref = this.__values[id];
          ++ref.referenceCount;
          ref.value = value;
        } else {
          this.__values[id] = {
            referenceCount: 1,
            value: value
          };
        }
      },
      __releaseValueReference: function (value) {
        var id = this.__idSelector(value);
        if (!hasOwn(this.__values, id))
          throw new Error('Assertion error: Value with id `' + id + '` was expected to be referenced.');
        if (--this.__values[id].referenceCount === 0)
          delete this.__values[id];
      },
      openView: function (queryConfiguration) {
        var query = (queryConfiguration || function (x) {
          return x;
        })(new QueryConfigurator());
        var key = AbstractDataSource.OpenViewKey.fromQuery(query);
        var existing = js.arrays.singleOrNull(this.__openViewReferences, function (v) {
          return key.equals(v.key);
        });
        if (existing)
          return existing.addReference().view;
        else {
          var view = new ServerSideView(this, query, function () {
            return ref.releaseReference();
          });
          var ref = new AbstractDataSource.OpenViewReference(key, view, function () {
            return this.__openViewReferences.splice(this.__openViewReferences.indexOf(ref), 1);
          }.bind(this));
          this.__openViewReferences.push(ref);
          return view;
        }
      },
      streamValues: function (queryConfiguration) {
        /** @type {?} */
        var query = (queryConfiguration || function (x) {
          return x;
        })(new QueryConfigurator());
        return this.__querier['issue'](query.unwrapArguments().normalize()).then(function (r) {
          return r.values;
        });
      },
      dispose: function () {
        this.__observableEntries.dispose();
        if (this.__openViewReferences.length) {
          var views = this.__openViewReferences.length;
          var referenceCount = this.__openViewReferences.reduce(function (c, r) {
            return c + r.referenceCount;
          }, 0);
          window.console.warn('Some views were not or are not yet disposed (' + views + ' views, ' + referenceCount + ' references).');
        }
      }
    };
    ServerSideDataSource.prototype = js.objects.extend({}, AbstractDataSource.prototype, {
      get 'size'() {
        return this.size;
      },
      'dispose': ServerSideDataSource.prototype.dispose,
      'openView': ServerSideDataSource.prototype.openView,
      'streamValues': ServerSideDataSource.prototype.streamValues
    }, ServerSideDataSource.prototype);
    /**
     * @constructor
     * @template V, O
     * @extends {de.benshu.ko.dataSource.View<V, O>}
     *
     * @param {ServerSideDataSource} dataSource
     * @param query
     * @param disposer
     */
    function ServerSideView(dataSource, query, disposer) {
      var requestPending = ko.observable(false);
      var dirty = ko.observable(false);
      var metadata = ko.observable({
        'unfilteredSize': dataSource.size.peek(),
        'filteredSize': 0
      });
      var previousValues = lists.newArrayList();
      var receivedValues = ko.observable();
      var cache = [];
      var cacheRangeFroms = [];
      var cacheRangeTos = [];
      var lastPredicate = null;
      var lastComparator = null;
      var computer = ko.pureComputed(function () {
        if (requestPending.peek())
          return requestPending();
        var q = query.unwrapArguments().normalize();
        if (isCached(q))
          return receivedValues(cache.slice(q.offset, q.offset + q.limit));
        dirty(true);
        requestPending(true);
        window.setTimeout(function () {
          if (!q.equals(query.unwrapArguments().normalize()))
            return requestPending(false);
          dataSource.__querier['issue'](q).then(function (r) {
            var newlyReceivedValues = [];
            r['values'].reduce(function (_, v) {
              return newlyReceivedValues.push(v);
            });
            receivedValues(newlyReceivedValues);
            delete r['values'];
            dataSource.__size(r['unfilteredSize']);
            metadata(r);
            cacheResult(q, newlyReceivedValues);
          }).then(function () {
            dirty(false);
            requestPending(false);
          }, function () {
            requestPending(false);
          });
        });  // TODO maybe the user wants to specify a delay > 0 ?
      });
      function isCached(q) {
        if (q.predicate !== lastPredicate || q.comparator !== lastComparator)
          return false;
        for (var i = 0, l = cacheRangeFroms.length; i < l; ++i) {
          var from = cacheRangeFroms[i], to = cacheRangeTos[i];
          if (from <= q.offset && to >= q.offset + q.limit)
            return true;
        }
        return false;
      }
      function cacheResult(q, result) {
        if (q.predicate !== lastPredicate || q.comparator !== lastComparator) {
          resetCache(q.predicate, q.comparator);
        }
        var from = q.offset, to = from + q.limit;
        var mergedFrom = from, mergedTo = to;
        var i, j, l;
        for (i = 0, j = 0, l = cacheRangeFroms.length; i < l; ++i) {
          var rangeFrom = cacheRangeFroms[j] = cacheRangeFroms[i], rangeTo = cacheRangeTos[j] = cacheRangeTos[i];
          if (mergedFrom <= rangeTo && mergedTo >= rangeFrom) {
            mergedFrom = Math.min(rangeFrom, mergedFrom);
            mergedTo = Math.max(rangeTo, mergedTo);
          } else
            ++j;
        }
        cacheRangeFroms.length = cacheRangeTos.length = j;
        cacheRangeFroms.push(mergedFrom);
        cacheRangeTos.push(mergedTo >= metadata()['filteredSize'] ? Number.POSITIVE_INFINITY : mergedTo);
        for (i = 0, l = result.length; i < l; ++i)
          cache[from + i] = result[i];
        window.console.log('Cache ranges:');
        for (i = 0, l = cacheRangeFroms.length; i < l; ++i)
          window.console.log('[' + cacheRangeFroms[i] + ', ' + cacheRangeTos[i] + ']');
      }
      function resetCache(predicate, comparator) {
        cache = [];
        cacheRangeFroms = [];
        cacheRangeTos = [];
        lastPredicate = predicate;
        lastComparator = comparator;
      }
      var values = ko.pureComputed(function () {
        computer();
        // wake up the computer
        var newValues = receivedValues();
        var result = lists.newArrayList(newValues);
        if (observablesList) {
          observablesList = result.map(function (v) {
            dataSource.__addValueReference(v);
            return dataSource.__observableEntries.addReference(v);
          });
          previousValues.forEach(function (v) {
            dataSource.__releaseValueReference(v);
            dataSource.__observableEntries.releaseReference(v);
          });
        } else {
          result.forEach(dataSource.__addValueReference.bind(dataSource));
          previousValues.forEach(dataSource.__releaseValueReference.bind(dataSource));
        }
        previousValues = result;
        return result;
      });
      this.__values = values;
      var observablesList = null;
      this.__observables = ko.pureComputed(function () {
        values();
        // the values computation updates the observablesList
        if (!observablesList)
          observablesList = previousValues.map(dataSource.__observableEntries.addReference);
        return observablesList;
      });
      this.__observables.subscribe(function () {
        return observablesList = null;
      }, null, 'asleep');
      this.__dirty = ko.pureComputed(function () {
        return dirty();
      });
      this.__metadata = ko.pureComputed(function () {
        return metadata();
      });
      this.__filteredSize = ko.pureComputed(function () {
        return metadata()['filteredSize'];
      });
      this.__size = ko.pureComputed(function () {
        return values().length;
      });
      this.__dispose = function () {
        computer.dispose();
        disposer();
      };
    }
    ServerSideView.prototype = {
      get dirty() {
        return this.__dirty;
      },
      get filteredSize() {
        return this.__filteredSize;
      },
      get metadata() {
        return this.__metadata;
      },
      get observables() {
        return this.__observables;
      },
      get size() {
        return this.__size;
      },
      get values() {
        return this.__values;
      },
      dispose: function () {
        this.__dispose();
      }
    };
    ServerSideView.prototype = js.objects.extend({}, {
      get 'dirty'() {
        return this.dirty;
      },
      get 'filteredSize'() {
        return this.filteredSize;
      },
      get 'metadata'() {
        return this.metadata;
      },
      get 'observables'() {
        return this.observables;
      },
      get 'size'() {
        return this.size;
      },
      get 'values'() {
        return this.values;
      },
      'dispose': ServerSideView.prototype.dispose
    }, ServerSideView.prototype);
    return ServerSideDataSource;
  }({});
  ko_data_source_streams_streams = function (lists, ListStream) {
    return {
      'streamArray': function (array) {
        return new ListStream(lists.newArrayList(array));
      }
    };
  }(onefold_lists, ko_data_source_streams_list_stream);
  ko_data_source_ko_data_source = function (ClientSideDataSource, DefaultObservableStateTransitioner, ObservableEntries, ServerSideDataSource, streams) {
    return {
      'ClientSideDataSource': ClientSideDataSource,
      'DefaultObservableStateTransitioner': DefaultObservableStateTransitioner,
      'ObservableEntries': ObservableEntries,
      'ServerSideDataSource': ServerSideDataSource,
      'streams': streams
    };
  }(ko_data_source_client_side_data_source_client_side_data_source, ko_data_source_default_observable_state_transitioner, ko_data_source_observable_entries, ko_data_source_server_side_data_source_server_side_data_source, ko_data_source_streams_streams);
  ko_data_source = function (main) {
    return main;
  }(ko_data_source_ko_data_source);
  return ko_data_source;
}(indexed_list, stringifyable, onefold_lists, onefold_js, knockout);
ko_entry = function (indexed_list, stringifyable, onefold_lists, onefold_js, ko_data_source, knockout) {
  var ko_entry_binding, ko_entry;
  ko_entry_binding = function (ko) {
    var BINDING_NAME = 'entry';
    var BINDING_NAME_OPTIONAL = 'optionalEntry';
    var OPTION_ENTRY_ID = 'identifiedBy';
    var OPTION_DATA_SOURCE = 'from';
    var OPTION_ENTRY_NAME = 'as';
    var DEFAULT_ENTRY_NAME = 'entry';
    createBinding(BINDING_NAME_OPTIONAL, true);
    return createBinding(BINDING_NAME, false);
    function createBinding(name, optional) {
      var binding = ko.bindingHandlers[name] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          var value = ko.unwrap(valueAccessor()), dataSource = value && value[OPTION_DATA_SOURCE] || allBindingsAccessor.has(OPTION_DATA_SOURCE) && allBindingsAccessor.get(OPTION_DATA_SOURCE), entryName = value && value[OPTION_ENTRY_NAME] || allBindingsAccessor.has(OPTION_ENTRY_NAME) && allBindingsAccessor.get(OPTION_ENTRY_NAME) || DEFAULT_ENTRY_NAME;
          var bindingContextExtension = {};
          bindingContextExtension[entryName] = ko.observable(null);
          var innerHtml = element.innerHTML, extendedBindingContext = bindingContext.extend(bindingContextExtension), displaying = false;
          element.innerHTML = '';
          var entryView = null, computer = ko.computed(function () {
              var value = ko.unwrap(valueAccessor()), entryId = ko.unwrap(value && value[OPTION_ENTRY_ID] || value), newEntryView = entryId && dataSource.openOptionalEntryView(entryId), observable = newEntryView && newEntryView.observable, display = !!(optional || newEntryView && observable);
              if (display) {
                extendedBindingContext[entryName](observable);
                if (!displaying) {
                  element.innerHTML = innerHtml;
                  ko.applyBindingsToDescendants(extendedBindingContext, element);
                }
              } else if (displaying)
                while (element.firstChild)
                  ko.removeNode(element.firstChild);
              if (entryView)
                entryView.dispose();
              entryView = newEntryView;
              displaying = display;
            });
          ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            computer.dispose();
            entryView.dispose();
          });
          return { 'controlsDescendantBindings': true };
        }
      };
      return binding;
    }
  }(knockout);
  ko_entry = function (main) {
    return main;
  }(ko_entry_binding);
  return ko_entry;
}(indexed_list, stringifyable, onefold_lists, onefold_js, ko_data_source, knockout);
onefold_dom = function () {
  var onefold_dom_internal, onefold_dom;
  onefold_dom_internal = function () {
    function strictlyContains(container, node) {
      return !!(container.compareDocumentPosition(node) & 16);
    }
    function determineDepth(root, node) {
      var depth = 0;
      while (node) {
        if (node === root)
          return depth;
        node = node.parentNode;
        ++depth;
      }
      throw new Error('The given node is not part of the subtree.');
    }
    var Element = window.Element;
    var matches = Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.matches;
    function closest(element, selector) {
      do {
        if (matches.call(element, selector))
          return element;
        element = element.parentElement;
      } while (element);
      return null;
    }
    return {
      determineDepth: determineDepth,
      isOrContains: function (container, node) {
        return container === node || strictlyContains(container, node);
      },
      strictlyContains: strictlyContains,
      element: {
        closest: closest,
        matches: function (element, selector) {
          return matches.call(element, selector);
        }
      }
    };
  }();
  onefold_dom = function (main) {
    return main;
  }(onefold_dom_internal);
  return onefold_dom;
}();
ko_indexed_repeat = function (knockout) {
  var ko_indexed_repeat_accessors, ko_indexed_repeat_configuration, ko_indexed_repeat_string_hashtable, ko_indexed_repeat_synchronizer, ko_indexed_repeat_binding, ko_indexed_repeat;
  ko_indexed_repeat_accessors = function () {
    function ArrayAccessor(array) {
      this.length = function () {
        return array.length;
      };
      this.get = function (index) {
        return array[index];
      };
    }
    function ListWithLengthMethod(list) {
      this.length = function () {
        return list.length();
      };
      this.get = function (index) {
        return list.get(index);
      };
    }
    function ListWithLengthProperty(list) {
      this.length = function () {
        return list.length;
      };
      this.get = function (index) {
        return list.get(index);
      };
    }
    function inferAccessor(arrayOrList) {
      if (Array.isArray(arrayOrList))
        return ArrayAccessor;
      else
        return inferListAccessor(arrayOrList);
    }
    function inferListAccessor(list) {
      var s = typeof list.length;
      switch (typeof list.length) {
      case 'function':
        return ListWithLengthMethod;
      case 'number':
        return ListWithLengthProperty;
      default:
        throw new Error('Unsupported type: The `forEach` value must be an array or a list with a `length` property or method.');
      }
    }
    return { inferAccessor: inferAccessor };
  }();
  ko_indexed_repeat_configuration = function (ko) {
    var OPTION_INDEXED_BY = 'indexedBy';
    var OPTION_AS = 'as';
    var OPTION_AT = 'at';
    var OPTION_ALLOW_ELEMENT_RECYCLING = 'allowElementRecycling';
    var OPTION_BEFORE_ELEMENT_RECYCLYING = 'beforeElementRecycling';
    var OPTION_AFTER_ELEMENT_RECYCLED = 'afterElementRecycled';
    var OPTION_ALLOW_DEVIATION = 'allowDeviation';
    var OPTION_ON_DEVIATION = 'onDeviation';
    var OPTION_ON_SYNCHRONIZATION = 'onSynchronization';
    var document = window.document;
    function selectorFunction(propertyNameOrSelectorFunction) {
      if (typeof propertyNameOrSelectorFunction === 'function')
        return propertyNameOrSelectorFunction;
      else if (typeof propertyNameOrSelectorFunction === 'string')
        return function (item) {
          return item[propertyNameOrSelectorFunction];
        };
      throw new Error('A repeat-binding must specify and indexedBy of type string (property name) or function (custom selector).');
    }
    function prepareItemTemplate(element) {
      ko.cleanNode(element);
      window.setTimeout(function () {
        // for some reason, the above cleanNode is insufficient, probably because applyBindingsToNode
        // sets up part of the state after calling init (and thus the cleanNode above)
        ko.cleanNode(element);
      }, 1);
      var itemTemplate = element.cloneNode(true);
      itemTemplate.removeAttribute('data-bind');
      if (typeof element.getAttribute('data-repeat-bind') === 'string') {
        itemTemplate.setAttribute('data-bind', element.getAttribute('data-repeat-bind'));
        itemTemplate.removeAttribute('data-repeat-bind');
      }
      return itemTemplate;
    }
    return function Configuration(element, value) {
      var self = this;
      var bindingString = element.getAttribute('data-bind');
      self.idSelector = selectorFunction(value[OPTION_INDEXED_BY]);
      self.itemVariableName = value[OPTION_AS] || '$item';
      self.indexVariableName = value[OPTION_AT] || '$index';
      self.allowElementRecycling = value[OPTION_ALLOW_ELEMENT_RECYCLING] !== false;
      self.reportElementRecycling = value[OPTION_BEFORE_ELEMENT_RECYCLYING] || function () {
      };
      self.reportElementRecycled = value[OPTION_AFTER_ELEMENT_RECYCLED] || function () {
      };
      self.allowDeviation = value[OPTION_ALLOW_DEVIATION] === true;
      self.reportDeviation = value[OPTION_ON_DEVIATION] || function () {
      };
      self.reportSynchronization = value[OPTION_ON_SYNCHRONIZATION] || function () {
      };
      self.parent = element.parentNode;
      self.startMarker = document.createComment('[repeat(' + bindingString + ')');
      self.endMarker = document.createComment('repeat(' + bindingString + ')]');
      self.itemElementTemplate = prepareItemTemplate(element);
      self.disposeIndicatorNode = self.startMarker;
    };
  }(knockout);
  ko_indexed_repeat_string_hashtable = function () {
    function StringHashtable() {
      this._size = 0;
      this._hashtable = {};
    }
    StringHashtable.prototype = {
      add: function (k, v) {
        if (Object.prototype.hasOwnProperty.call(this._hashtable, k))
          throw new Error('Key `' + k + '` is already taken.');
        ++this._size;
        this._hashtable[k] = v;
      },
      get: function (k) {
        return this._hashtable[k];
      },
      remove: function (k) {
        if (!Object.prototype.hasOwnProperty.call(this._hashtable, k))
          throw new Error('No entry for key  `' + k + '` present.');
        delete this._hashtable[k];
        --this._size;
      },
      clear: function () {
        this._hashtable = {};
        this._size = 0;
      },
      get size() {
        return this._size;
      },
      forEach: function (action) {
        for (var k in this._hashtable)
          if (Object.prototype.hasOwnProperty.call(this._hashtable, k))
            action(k, this._hashtable[k]);
      }
    };
    return StringHashtable;
  }();
  ko_indexed_repeat_synchronizer = function (ko, StringHashtable) {
    var requestAnimationFrame = window.requestAnimationFrame.bind(window), cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
    /** @constructor */
    function ElementWithBindingContext(element, bindingContext) {
      var self = this;
      self.element = element;
      self.bindingContext = bindingContext;
    }
    /** @constructor */
    function AddedItem(index, item, id, previousId) {
      var self = this;
      self.index = index;
      self.item = item;
      self.id = id;
      self.previousId = previousId;
    }
    return function Synchronizer(configuration, bindingContext) {
      var self = this,
        // extract constants from the configuration
        idSelector = configuration.idSelector, itemVariableName = configuration.itemVariableName, indexVariableName = configuration.indexVariableName, allowDeviation = configuration.allowDeviation, reportDeviation = configuration.reportDeviation, reportSynchronization = configuration.reportSynchronization, parent = configuration.parent, startMarker = configuration.startMarker, endMarker = configuration.endMarker, itemElementTemplate = configuration.itemElementTemplate,
        // the core state -- when a synchronization is in progress, currentItems may be more current than itemElements
        currentItems = null, itemElements = new StringHashtable(),
        // id
        synchronizedCount = 0,
        // the number of items for which elements are present in the DOM (may deviate from itemElements.size())
        // state of the current synchronization (if one is in progress)
        step = 0,
        // synchronization step counter
        cursor = null,
        // cursor into the DOM for phase one and two (collectNewItemsAndMarkDeados/collectCarcasses)
        animationFrameRequest = null,
        // request for the next step, if synchronization is incremental
        addedItems = null,
        // items for which no element exists (yet)
        presumedDead = null,
        // elements for removed items by id, may contain false positives for moved back items
        carcasses = null;
      // elements for definitely removed items (no false positives)
      function startNewSynchronization(newItems) {
        step = 0;
        cursor = configuration.startMarker;
        addedItems = [];
        presumedDead = new StringHashtable();
        currentItems = newItems;
        if (allowDeviation)
          initiateIncrementalSynchronization();
        else
          performImmediateSynchronization();
      }
      function performImmediateSynchronization() {
        while (performSynchronizationStep())
          ++step;
        finalizeSynchronization();
      }
      function initiateIncrementalSynchronization() {
        performIncrementalSynchronizationStep(new Date().getTime() + 15);  // TODO magic number, allow configuration?
      }
      function resumeIncrementalSynchronization() {
        performIncrementalSynchronizationStep(new Date().getTime() + 40);  // TODO magic number, allow configuration?
      }
      function performIncrementalSynchronizationStep(timelimit) {
        while (performSynchronizationStep()) {
          ++step;
          if (new Date().getTime() > timelimit) {
            reportDeviation();
            animationFrameRequest = requestAnimationFrame(resumeIncrementalSynchronization);
            return;
          }
        }
        finalizeSynchronization();
      }
      function performSynchronizationStep() {
        if (step < currentItems.length())
          collectNewItemsAndMarkDeados(step, currentItems.get(step));
        else if (!carcasses)
          collectCarcasses();
        else if (addedItems.length)
          if (configuration.allowElementRecycling && carcasses.length)
            performNecromancy(carcasses.pop(), addedItems.shift());
          else
            insertElementFor(addedItems.shift());
        else
          return incinerateCarcasses() && false;
        return true;
      }
      function collectNewItemsAndMarkDeados(index, item) {
        var previousId = index ? idSelector(currentItems.get(index - 1)) : null;
        var id = idSelector(item);
        var elementWithBindingContext = itemElements.get(id);
        if (elementWithBindingContext) {
          elementWithBindingContext.element.style.display = '';
          elementWithBindingContext.bindingContext[indexVariableName](index);
          var notDeadAfterAll = presumedDead.get(id);
          if (notDeadAfterAll) {
            presumedDead.remove(id);
            parent.insertBefore(notDeadAfterAll, cursor.nextSibling);
            cursor = notDeadAfterAll;
          } else {
            while (elementWithBindingContext.element !== cursor.nextSibling)
              presumeDead(cursor.nextSibling);
            cursor = elementWithBindingContext.element;
          }
        } else {
          addedItems.push(new AddedItem(index, item, id, previousId));
        }
      }
      function collectCarcasses() {
        carcasses = [];
        var aliveAndKicking = currentItems.length() - addedItems.length;
        for (var i = synchronizedCount - presumedDead.size - aliveAndKicking; i > 0; --i)
          presumeDead(cursor.nextSibling);
        presumedDead.forEach(function (key, element) {
          itemElements.remove(key);
          carcasses.push(element);
        });
        presumedDead.clear();
      }
      function performNecromancy(carcass, addedItem) {
        var revivedBindingContext = ko.contextFor(carcass);
        configuration.reportElementRecycling(carcass, revivedBindingContext);
        carcass.style.display = '';
        insertNodeAfter(carcass, addedItem.previousId);
        revivedBindingContext[itemVariableName](addedItem.item);
        revivedBindingContext[indexVariableName](addedItem.index);
        configuration.reportElementRecycled(carcass, revivedBindingContext);
        itemElements.add(addedItem.id, new ElementWithBindingContext(carcass, revivedBindingContext));
      }
      function insertElementFor(newborn) {
        var element = itemElementTemplate.cloneNode(true);
        var contextExtension = {};
        contextExtension[indexVariableName] = ko.observable(newborn.index);
        contextExtension[itemVariableName] = ko.observable(newborn.item);
        var newBindingContext = bindingContext.extend(contextExtension);
        itemElements.add(newborn.id, new ElementWithBindingContext(element, newBindingContext));
        ko.applyBindings(newBindingContext, element);
        insertNodeAfter(element, newborn.previousId);
        ++synchronizedCount;
      }
      function incinerateCarcasses() {
        while (carcasses.length)
          ko.removeNode(carcasses.pop());
      }
      function finalizeSynchronization() {
        for (var i = 0; i < carcasses.length; ++i)
          ko.removeNode(carcasses[i]);
        synchronizedCount = currentItems.length();
        reset();
        reportSynchronization();
      }
      function reset() {
        step = 0;
        cursor = null;
        addedItems = null;
        presumedDead = null;
        carcasses = null;
      }
      function insertNodeAfter(node, previousId) {
        var before = (previousId ? itemElements.get(previousId).element : startMarker).nextSibling;
        parent.insertBefore(node, before);
      }
      function presumeDead(element) {
        presumedDead.add(idFor(element), element);
        element.style.display = 'none';
        parent.insertBefore(element, endMarker);
        return element;
      }
      function idFor(e) {
        return idSelector(ko.contextFor(e)[itemVariableName]());
      }
      self.startOrRestartSynchronization = function (newItems) {
        abortActiveSynchronization();
        startNewSynchronization(newItems);
      };
      self.abortActiveSynchronization = abortActiveSynchronization;
      function abortActiveSynchronization() {
        if (!animationFrameRequest)
          return;
        cancelAnimationFrame(animationFrameRequest);
        animationFrameRequest = null;
        for (var i = 0; carcasses !== null && i < carcasses.length; ++i) {
          var element = carcasses[i];
          itemElements.add(idFor(element), new ElementWithBindingContext(element, ko.contextFor(element)));
        }
        reset();
      }
    };
  }(knockout, ko_indexed_repeat_string_hashtable);
  ko_indexed_repeat_binding = function (ko, accessors, Configuration, Synchronizer) {
    var OPTION_FOR_EACH = 'forEach';
    var binding = ko.bindingHandlers['indexedRepeat'] = {
      'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        var configuration = new Configuration(element, value);
        var disposeIndicatorNode = configuration.disposeIndicatorNode;
        configuration.parent.replaceChild(configuration.endMarker, element);
        configuration.parent.insertBefore(configuration.startMarker, configuration.endMarker);
        var synchronizer = new Synchronizer(configuration, bindingContext);
        if (configuration.allowDeviation)
          ko.utils.domNodeDisposal.addDisposeCallback(disposeIndicatorNode, function () {
            synchronizer.abortActiveSynchronization();
          });
        var items = value[OPTION_FOR_EACH];
        var Accessor = accessors.inferAccessor(items());
        return {
          'controlsDescendantBindings': true,
          'subscribable': ko.computed(function () {
            var newItems = new Accessor(items());
            ko.ignoreDependencies(synchronizer.startOrRestartSynchronization, synchronizer, [newItems]);
          }, null, { 'disposeWhenNodeIsRemoved': disposeIndicatorNode })
        };
      }
    };
    return binding;
  }(knockout, ko_indexed_repeat_accessors, ko_indexed_repeat_configuration, ko_indexed_repeat_synchronizer);
  ko_indexed_repeat = function (main) {
    return main;
  }(ko_indexed_repeat_binding);
  return ko_indexed_repeat;
}(knockout);
ko_grid = function (onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_application_event_dispatcher, ko_grid_template, text, text_ko_grid_columnshtmltemplate, ko_grid_columns, text_ko_grid_datahtmltemplate, ko_grid_data, text_ko_grid_headershtmltemplate, ko_grid_headers, ko_grid_layout, ko_grid_core, ko_grid_extensions, text_ko_grid_gridhtmltemplate, ko_grid_binding, ko_grid;
  ko_grid_application_event_dispatcher = function (js, dom) {
    /** @constructor */
    function ApplicationEvent(originalEvent) {
      var commonProperties = [
        'altKey',
        'bubbles',
        'cancelable',
        'ctrlKey',
        'currentTarget',
        'detail',
        'eventPhase',
        'metaKey',
        'relatedTarget',
        'shiftKey',
        'target',
        'timeStamp',
        'type',
        'view',
        'which'
      ];
      var typeProperties = {
        'key': [
          'char',
          'charCode',
          'key',
          'keyCode'
        ],
        'mouse': [
          'button',
          'buttons',
          'clientX',
          'clientY',
          'offsetX',
          'offsetY',
          'pageX',
          'pageY',
          'screenX',
          'screenY',
          'toElement'
        ]
      };
      var properties = commonProperties.concat(typeProperties[originalEvent.type.substr(0, 3)] || []).concat(typeProperties[originalEvent.type.substr(0, 5)] || []);
      this.__originalEvent = originalEvent;
      this.__applicationDefaultPrevented = originalEvent.defaultPrevented;
      properties.forEach(function (p) {
        return Object.defineProperty(this, p, {
          get: function () {
            return originalEvent[p];
          }
        });
      }.bind(this));  //function ApplicationEvent() {
                      //    var applicationDefaultPrevented = originalEvent.defaultPrevented;
                      //
                      //    js.objects.extend(this, {
                      //        preventDefault: function () {
                      //            applicationDefaultPrevented = true;
                      //            return originalEvent.preventDefault();
                      //        },
                      //        preventApplicationButAllowBrowserDefault: function () {
                      //            applicationDefaultPrevented = true;
                      //        },
                      //        get defaultPrevented() {
                      //            return applicationDefaultPrevented;
                      //        }
                      //    });
                      //}
                      //
                      //// While this isn't great performance-wise, copying properties manually
                      //// probably would not be either. Unless one wrote a special constructor
                      //// per event type, perhaps.
                      //ApplicationEvent.prototype = originalEvent;
                      //
                      //return new ApplicationEvent();
    }
    ApplicationEvent.prototype = {
      preventDefault: function () {
        this.__applicationDefaultPrevented = true;
        return this.__originalEvent.preventDefault();
      },
      preventApplicationButAllowBrowserDefault: function () {
        this.__applicationDefaultPrevented = true;
      },
      get defaultPrevented() {
        return this.__applicationDefaultPrevented;
      }
    };
    ApplicationEvent.prototype = js.objects.extend({}, {
      get 'defaultPrevented'() {
        return this.defaultPrevented;
      },
      'preventDefault': ApplicationEvent.prototype.preventDefault,
      'preventApplicationButAllowBrowserDefault': ApplicationEvent.prototype.preventApplicationButAllowBrowserDefault
    }, ApplicationEvent.prototype);
    /** @constructor */
    function ApplicationEventHandler(handler, selector) {
      this.handler = handler;
      this.selector = selector;
    }
    /** @constructor */
    function ApplicationEventDispatcher(argumentsSupplier) {
      argumentsSupplier = argumentsSupplier || function (event) {
        return [event];
      };
      var handlers = [];
      this.registerHandler = function (selectorOrHandler, handler) {
        var selector = arguments.length > 1 ? selectorOrHandler : undefined;
        handler = arguments.length > 1 ? handler : selectorOrHandler;
        handlers.push(new ApplicationEventHandler(handler, selector));
        return {
          dispose: function () {
            if (handler) {
              handlers.splice(handlers.indexOf(handler), 1);
              handler = null;
            }
          }
        };
      };
      this.relativeToClosest = function (ancestorSelector) {
        return {
          dispatch: function (event) {
            var closestAncestor = dom.element.closest(event.target, ancestorSelector);
            if (closestAncestor) {
              var applicationEvent = new ApplicationEvent(event);
              dispatch(closestAncestor, applicationEvent, argumentsSupplier(applicationEvent, closestAncestor));
            }
          }
        };
      };
      function dispatch(root, event, handlerArguments) {
        function findDeepestMatch(selector) {
          var matches = Array.prototype.slice.call(root.querySelectorAll(selector)).filter(function (match) {
            return dom.isOrContains(match, event.target);
          });
          return matches.length ? matches[matches.length - 1] : undefined;
        }
        var determineDepth = dom.determineDepth.bind(null, root);
        var handlersAndTheirMatches = handlers.map(function (candidate) {
          var match = candidate.selector ? findDeepestMatch(candidate.selector) : root;
          return {
            handler: candidate.handler,
            match: match,
            depth: match ? determineDepth(match) : -1
          };
        });
        var applicableHandlers = handlersAndTheirMatches.filter(function (candidate) {
          return !!candidate.match;
        });
        js.arrays.stableSort(applicableHandlers, function (a, b) {
          return b.depth - a.depth;
        });
        applicableHandlers.forEach(function (h) {
          h.handler.apply(root, handlerArguments);
        });
      }
    }
    return ApplicationEventDispatcher;
  }(onefold_js, onefold_dom);
  ko_grid_template = function () {
    var PLACEHOLDER_KIND_REGULAR = 1;
    var PLACEHOLDER_KIND_BEFORE_AFTER = 2;
    var PLACEHOLDER_ID_PATTERN = /^[a-z]+(-[a-z]+)*$/;
    var PLACEHOLDER_MARKUP_PATTERN = /<!--(?:(before|after):)?([a-z]+(-[a-z]+)*)-->*/g;
    var OPERATOR_REPLACE = 1;
    var OPERATOR_INTO = 2;
    var OPERATOR_BEFORE = 3;
    var OPERATOR_AFTER = 4;
    var OPERATOR_TO_APPEND = 5;
    var OPERATOR_TO_PREPEND = 6;
    /** @constructor */
    // TODO eliminate mutation, move towards returning a new template at each step
    function GridTemplate(initialMarkup) {
      var placeholders = {};
      var checkValidPlaceholderId = function (id) {
        if (!PLACEHOLDER_ID_PATTERN.test(id))
          throw new Error('Invalid placeholder id `' + id + '`');
      };
      var registerPlaceholder = function (id, kind) {
        checkValidPlaceholderId(id);
        if (placeholders[id])
          throw new Error('Placeholder id `' + id + '` is already taken.');
        placeholders[id] = kind;
      };
      var registerPlaceholdersInMarkup = function (markup) {
        var match;
        while (!!(match = PLACEHOLDER_MARKUP_PATTERN.exec(markup))) {
          var beforeAfter = match[1], before = beforeAfter === 'before', id = match[2];
          if (beforeAfter && (markup.match(new RegExp((before ? 'after' : 'before') + ':' + id, 'g')) || []).length !== 1)
            throw new Error('Multiple or unmatched before-/after-placeholders for placeholder id `' + id + '`.');
          if (!beforeAfter || before)
            registerPlaceholder(id, beforeAfter ? PLACEHOLDER_KIND_BEFORE_AFTER : PLACEHOLDER_KIND_REGULAR);
        }
      };
      var resolvePlaceholderId = function (id, operator) {
        if (!placeholders[id])
          throw new Error('Unknown placeholder id `' + id + '`.');
        var checkKind = function (kind) {
          if (placeholders[id] !== kind)
            throw new Error('Operation is not defined for placeholder `' + id + '`.');
        };
        var regularPlaceholder = '<!--' + id + '-->', beforePlaceholder = '<!--before:' + id + '-->', afterPlaceholder = '<!--after:' + id + '-->';
        switch (operator) {
        case OPERATOR_REPLACE:
          checkKind(PLACEHOLDER_KIND_REGULAR);
          delete placeholders[id];
          return regularPlaceholder;
        case OPERATOR_INTO:
          checkKind(PLACEHOLDER_KIND_REGULAR);
          return regularPlaceholder;
        case OPERATOR_BEFORE:
          checkKind(PLACEHOLDER_KIND_BEFORE_AFTER);
          return beforePlaceholder;
        case OPERATOR_AFTER:
          checkKind(PLACEHOLDER_KIND_BEFORE_AFTER);
          return afterPlaceholder;
        case OPERATOR_TO_APPEND:
        case OPERATOR_TO_PREPEND:
          return placeholders[id] === PLACEHOLDER_KIND_REGULAR ? regularPlaceholder : operator === OPERATOR_TO_APPEND ? afterPlaceholder : beforePlaceholder;
        }
        throw new Error('Assertion error. Unkown operator: `' + operator + '`');
      };
      var configuredTemplate = initialMarkup;
      registerPlaceholdersInMarkup(configuredTemplate);
      var replacePlaceholder = function (placeholder, id, markup, replacementProducer) {
        if (id)
          registerPlaceholder(id, PLACEHOLDER_KIND_BEFORE_AFTER);
        registerPlaceholdersInMarkup(markup);
        var replacementMarkup = id ? resolvePlaceholderId(id, OPERATOR_BEFORE) + markup + resolvePlaceholderId(id, OPERATOR_AFTER) : markup;
        var replacement = replacementProducer(placeholder, replacementMarkup);
        configuredTemplate = configuredTemplate.replace(placeholder, replacement);
      };
      /**
       * @param {number} operator
       * @param {function(string,string)=} replacementProducer
       * @returns {Function}
       */
      var createPlaceholderReplacementOperation = function (operator, replacementProducer) {
        replacementProducer = replacementProducer || function (p, m) {
          return m + p;
        };
        return function (placeholderId) {
          var placeholder = resolvePlaceholderId(placeholderId, operator);
          return {
            insert: function (idOrMarkup, markup) {
              var id = markup ? idOrMarkup : null;
              markup = markup ? markup : idOrMarkup;
              replacePlaceholder(placeholder, markup ? id : null, markup, replacementProducer);
            }
          };
        };
      };
      this.into = createPlaceholderReplacementOperation(OPERATOR_INTO);
      this.before = createPlaceholderReplacementOperation(OPERATOR_BEFORE);
      this.after = createPlaceholderReplacementOperation(OPERATOR_AFTER, function (p, m) {
        return p + m;
      });
      this.replace = function (placeholderId) {
        return {
          with: createPlaceholderReplacementOperation(OPERATOR_REPLACE, function (p, m) {
            return m;
          })(placeholderId).insert
        };
      };
      this.to = function (placeholderId) {
        return {
          append: createPlaceholderReplacementOperation(OPERATOR_TO_APPEND)(placeholderId).insert,
          prepend: createPlaceholderReplacementOperation(OPERATOR_TO_PREPEND, function (p, m) {
            return p + m;
          })(placeholderId).insert
        };
      };
      this.build = function () {
        return configuredTemplate.replace(PLACEHOLDER_MARKUP_PATTERN, '');
      };
    }
    return GridTemplate;
  }();
  text = {
    load: function (id) {
      throw new Error('Dynamic load not allowed: ' + id);
    }
  };
  text_ko_grid_columnshtmltemplate = '<colgroup class="ko-grid-colgroup">\n    <col class="ko-grid-col" data-bind="indexedRepeat: { forEach: columns.displayed, indexedBy: \'id\', as: \'column\' }" data-repeat-bind="__gridColumn: column()">\n</colgroup>';
  ko_grid_columns = function (ko, js, columnsTemplate) {
    var TO_STRING_VALUE_RENDERER = function (cellValue) {
      return cellValue === null ? '' : '' + cellValue;
    };
    var columns = {
      init: function (template) {
        template.replace('columns').with(columnsTemplate);
      },
      Constructor: function (bindingValue, gridConfig, grid) {
        function createColumn(columnSpec) {
          var column = new Column(grid, gridConfig, columnSpec);
          if (gridConfig['columnInitializer'])
            gridConfig['columnInitializer'](column);
          return column;
        }
        var disposables = [];
        this.all = ko.observableArray(bindingValue['columns'].map(createColumn));
        this['all'] = this.all;
        this.byId = function (id) {
          var column = this.tryById(id);
          if (!column)
            throw new Error('The column id `' + id + '` is undefined.');
          return column;
        }.bind(this);
        this['byId'] = this.byId;
        this.tryById = function (id) {
          var candidates = this.all().filter(function (c) {
            return c.id === id;
          });
          if (candidates.length > 1)
            throw new Error('Assertion error: Multiple columns with id `' + id + '`.');
          return candidates[0];
        }.bind(this);
        this['tryById'] = this.tryById;
        var displayedColumns = ko.observable(this.all().filter(function (c) {
          return c.__visible;
        }));
        this.displayed = function () {
          return displayedColumns();
        };
        this['displayed'] = this.displayed;
        this.show = function (column) {
          this.showOnlyThoseWhich(function (c) {
            return c.__visible || c === column;
          });
        }.bind(this);
        this.hide = function (column) {
          this.showOnlyThoseWhich(function (c) {
            return c.__visible && c !== column;
          });
        }.bind(this);
        this['show'] = this.show;
        this['hide'] = this.hide;
        this.reorder = function (columns) {
          var source = this.all().slice();
          var destination = [];
          columns.forEach(function (column) {
            var index = source.indexOf(column);
            source.splice(index, 1);
            destination.push(column);
          });
          if (source.length)
            throw new Error('The new column order must contain all columns.');
          this.all(destination);
          this.showOnlyThoseWhich(function (c) {
            return c.__visible;
          });
        }.bind(this);
        this['reorder'] = this.reorder;
        this.showOnlyThoseWhich = function (predicate) {
          var allColumns = this.all();
          var columnsToBeDisplayed = allColumns.filter(predicate);
          allColumns.forEach(function (c) {
            c.__visible = false;
          });
          columnsToBeDisplayed.forEach(function (c) {
            c.__visible = true;
          });
          displayedColumns(columnsToBeDisplayed);
        }.bind(this);
        this['showOnlyThoseWhich'] = this.showOnlyThoseWhich;
        this.combinedWidth = ko.pureComputed(function () {
          var sum = 0;
          var displayed = this.displayed();
          for (var i = 0; i < displayed.length; ++i)
            sum += displayed[i].widthInPixels();
          return sum;
        }.bind(this));
        this['combinedWidth'] = this.combinedWidth;
        this.add = function (column) {
          var viewModel = createColumn({
            userDefined: false,
            'id': '$' + column.id,
            'label': column.label,
            'hidden': column.hidden || false,
            'width': column.width
          });
          this.all.unshift(viewModel);
          this.showOnlyThoseWhich(function (c) {
            return c.__visible;
          });
          return viewModel;
        }.bind(this);
        this['add'] = this.add;
        this._dispose = function () {
          disposables.forEach(function (disposable) {
            disposable.dispose();
          });
        };
      }
    };
    ko.bindingHandlers['__gridColumn'] = {
      'init': function () {
      },
      'update': function (element, valueAccessor) {
        var column = valueAccessor();
        element.style.width = column.width();
      }
    };
    /** @constructor */
    function Column(grid, gridConfig, column) {
      this.id = column['id'];
      this['id'] = this.id;
      this.property = column['property'] || this.id;
      this['property'] = this.property;
      this.userDefined = column.userDefined !== false;
      this['userDefined'] = this.userDefined;
      this.__visible = !column['hidden'];
      this.visible = function () {
        return this.__visible;
      }.bind(this);
      this['visible'] = this['visible'];
      this.label = ko.observable(column['label']);
      this['label'] = this.label;
      this.width = ko.observable(column['width']);
      this['width'] = this.width;
      this.widthInPixels = function () {
        var w = this.width();
        if (w.substr(-2) !== 'px')
          throw new Error('The only currently supported column width values are absolute pixel lengths.');
        return parseInt(w.substring(0, w.length - 2), 10);
      }.bind(this);
      this['widthInPixels'] = this.widthInPixels;
      this.headerClasses = ko.observableArray(column['headerClasses'] || column['classes'] || []);
      this.cellClasses = ko.observableArray(column['cellClasses'] || column['classes'] || []);
      this.footerClasses = ko.observableArray(column['footerClasses'] || column['classes'] || []);
      this['headerClasses'] = this.headerClasses;
      this['cellClasses'] = this.cellClasses;
      this['footerClasses'] = this.footerClasses;
      this.metadata = gridConfig['columnMetadataSupplier'] ? gridConfig['columnMetadataSupplier'](grid.bindingValue, column) : {};
      this['metadata'] = this.metadata;
      this.renderValue = gridConfig['cellValueRenderer'] ? gridConfig['cellValueRenderer'].bind(undefined, this) : TO_STRING_VALUE_RENDERER;
      this['renderValue'] = this.renderValue;
      this.overrideValueRendering = function (override) {
        this.renderValue = override(this.renderValue);
      }.bind(this);
      this.overrideValueBinding = function (override) {
        var overridden = this._overrideValueBinding(override, {
          init: this._initCell,
          update: this._updateCell
        });
        if (!overridden || !overridden.init || !overridden.update)
          throw new Error('The cell value binding must define an `init` as well as an `update` method.');
        this._initCell = overridden.init;
        this._updateCell = overridden.update;
      }.bind(this);
      this._overrideValueBinding = function (override, current) {
        var overridden = override(js.objects.extend({
          init: current.init,
          update: current.update
        }, {
          'init': current.init,
          'update': current.update
        }));
        return {
          init: overridden.init || overridden['init'],
          update: overridden.update || overridden['update']
        };
      };
      this['overrideValueRendering'] = this.overrideValueRendering;
      this['overrideValueBinding'] = this.overrideValueBinding;
    }
    return columns;
  }(knockout, onefold_js, text_ko_grid_columnshtmltemplate);
  text_ko_grid_datahtmltemplate = '<tbody class="ko-grid-tbody" data-bind="_gridWidth: columns.combinedWidth() + \'px\'">\n    <tr class="ko-grid-tr ko-grid-row"\n        data-bind="indexedRepeat: {\n            forEach: data.rows.displayed,\n            indexedBy: function(r) { return grid.data.observableValueSelector(ko.unwrap(r[grid.primaryKey])); },\n            as: \'row\',\n            at: \'rowIndex\',\n            beforeElementRecycling: data.rows.__handleElementRecycling,\n            afterElementRecycled: data.rows.__handleElementRecycled,\n            allowDeviation: true,\n            onDeviation: data.rows.__handleDisplayedRowsDeviate,\n            onSynchronization: data.rows.__handleDisplayedRowsSynchronized }"\n        data-repeat-bind="__gridRow: { classify: grid.data.rows.__classify, row: row, index: rowIndex }">\n\n        <td data-bind="indexedRepeat: { forEach: columns.displayed, indexedBy: \'id\', as: \'column\', allowElementRecycling: false }"\n            data-repeat-bind="__gridCell: { row: row, column: column }"></td>\n    </tr>\n</tbody>';
  ko_grid_data = function (ko, js, stringifyable, ApplicationEventDispatcher, dataTemplate) {
    var TEXT_NODE = window.Node.TEXT_NODE;
    var ELEMENT_NODE = window.Node.ELEMENT_NODE;
    var HIJACKED_KEY = '__@__hijacked';
    var document = window.document;
    var data = {
      init: function (template) {
        template.replace('body').with('body', dataTemplate);
        template.to('table').prepend(['<div class="ko-grid-load-indicator" data-bind="style: { display: data.rows.__dirty() ? \'block\' : \'none\' }">Loading&hellip;</div>'].join(''));
      },
      Constructor: function (bindingValue, config, grid) {
        var disposeCallbacks = [];
        /** @type {de.benshu.ko.dataSource.DataSource<?, ?, ?>} */
        this.source = bindingValue['dataSource'];
        this.valueSelector = bindingValue['valueSelector'] || config['valueSelector'] || function (p) {
          return p;
        };
        this['valueSelector'] = this.valueSelector;
        this.observableValueSelector = bindingValue['observableValueSelector'] || config['observableValueSelector'] || this.valueSelector;
        this['observableValueSelector'] = this.observableValueSelector;
        this.predicates = ko.observableArray(bindingValue.filters || []);
        this['predicates'] = this.predicates;
        this.predicate = ko.pureComputed(function () {
          return stringifyable.predicates.and(this.predicates().map(ko.unwrap));
        }.bind(this));
        this['predicate'] = this.predicate;
        this.comparator = ko.observable(stringifyable.comparators.indifferent);
        this['comparator'] = this.comparator;
        this.offset = ko.observable(0);
        this['offset'] = this.offset;
        this.limit = ko.observable(Number.POSITIVE_INFINITY);
        this['limit'] = this.limit;
        var view = this.source.openView(function (q) {
          return q.filteredBy(this.predicate).sortedBy(this.comparator).offsetBy(this.offset).limitedTo(this.limit);
        }.bind(this));
        disposeCallbacks.push(view.dispose.bind(view));
        this.view = view;
        this['view'] = view;
        this._postApplyBindings = function () {
        };
        this.__postApplyBindings = function (callback) {
          var innerCallback = this._postApplyBindings;
          this._postApplyBindings = function () {
            callback(innerCallback);
          };
        }.bind(this);
        disposeCallbacks.push(initTbodyElement.call(this, grid));
        disposeCallbacks.push(initRows.call(this));
        disposeCallbacks.push(initEventDispatching.call(this));
        disposeCallbacks.push(initElementLookup.call(this, grid));
        this._dispose = function () {
          disposeCallbacks.forEach(function (callback) {
            callback();
          });
        };
      }
    };
    function initTbodyElement(grid) {
      this.__postApplyBindings(function (inner) {
        inner();
        this.__tbodyElement = grid.element.querySelector('.ko-grid-tbody');
      }.bind(this));
      return function () {
        this.__tbodyElement = null;
      }.bind(this);
    }
    function initRows() {
      var disposables = [];
      var rows = {};
      this.rows = rows;
      this['rows'] = rows;
      rows.displayed = ko.observableArray([]);
      rows['displayed'] = rows.displayed;
      rows.displayedSynchronized = ko.observable(false).extend({ notify: 'always' });
      rows['displayedSynchronized'] = rows.displayedSynchronized;
      rows['__handleDisplayedRowsDeviate'] = function () {
        this.rows.displayedSynchronized(false);
      }.bind(this);
      rows['__handleDisplayedRowsSynchronized'] = function () {
        this.rows.displayedSynchronized(true);
      }.bind(this);
      var view = this.view;
      rows['__dirty'] = view.dirty;
      disposables.push(view.observables.subscribe(function (v) {
        rows.displayed(v);
      }));
      rows.displayed(view.observables());
      var classifiers = [];
      rows['__classify'] = function (row) {
        var classes = classifiers.map(function (c) {
          return c(row);
        });
        return Array.prototype.concat.apply([], classes);
      };
      rows.installClassifier = function (classifier) {
        classifiers.push(classifier);
      };
      rows['installClassifier'] = rows.installClassifier;
      return function () {
        disposables.forEach(function (disposable) {
          disposable.dispose();
        });
      };
    }
    function initEventDispatching() {
      var dispatchVia = function (dispatcher) {
        return function (event) {
          dispatcher.relativeToClosest('.ko-grid-cell').dispatch(event);
          return !event.defaultPrevented;
        };
      };
      var argumentsSupplier = function (event, cellElement) {
        var context = ko.contextFor(cellElement);
        var row = context['row']();
        var column = context['column']();
        var cell = row[column.property];
        return [
          event,
          cell,
          row,
          column
        ];
      };
      var onMouseDownDispatcher = new ApplicationEventDispatcher(argumentsSupplier);
      var onClickDispatcher = new ApplicationEventDispatcher(argumentsSupplier);
      var onDoubleClickDispatcher = new ApplicationEventDispatcher(argumentsSupplier);
      var onContextMenuDispatcher = new ApplicationEventDispatcher(argumentsSupplier);
      this.onCellMouseDown = onMouseDownDispatcher.registerHandler.bind(onMouseDownDispatcher);
      this.onCellClick = onClickDispatcher.registerHandler.bind(onClickDispatcher);
      this.onCellDoubleClick = onDoubleClickDispatcher.registerHandler.bind(onDoubleClickDispatcher);
      this.onCellContextMenu = onContextMenuDispatcher.registerHandler.bind(onContextMenuDispatcher);
      this['onCellMouseDown '] = this.onCellMouseDown;
      this['onCellClick '] = this.onCellClick;
      this['onCellDoubleClick '] = this.onCellDoubleClick;
      this['onCellContextMenu '] = this.onCellContextMenu;
      this.__postApplyBindings(function (inner) {
        inner();
        this.__tbodyElement.addEventListener('mousedown', dispatchVia(onMouseDownDispatcher));
        this.__tbodyElement.addEventListener('click', dispatchVia(onClickDispatcher));
        this.__tbodyElement.addEventListener('dblclick', dispatchVia(onDoubleClickDispatcher));
        this.__tbodyElement.addEventListener('contextmenu', dispatchVia(onContextMenuDispatcher));
      }.bind(this));
      return function () {
      };
    }
    function initElementLookup(grid) {
      var nthRowElement = function (n) {
        var node = this.__tbodyElement.firstChild;
        var i = -1;
        while (node) {
          if (node.nodeType === ELEMENT_NODE && node.tagName === 'TR' && (' ' + node.className + ' ').indexOf('ko-grid-row') >= 0)
            if (++i === n)
              return node;
          node = node.nextSibling;
        }
        throw new Error('Row `' + n + '` does not exist.');
      }.bind(this);
      var nthCellOfRow = function (row, n) {
        var node = row.firstChild;
        var i = -1;
        while (node) {
          if (node.nodeType === ELEMENT_NODE && node.tagName === 'TD' && (' ' + node.className + ' ').indexOf('td') >= 0)
            if (++i === n)
              return node;
          node = node.nextSibling;
        }
        throw new Error('Column `' + n + '` does not exist.');
      };
      var hijackCount = 0;
      var hijacks = {};
      this.rows['__handleElementRecycling'] = function (element, bindingContext) {
        withHijacksOf(element, bindingContext, function (cell, row, column) {
          cell[HIJACKED_KEY] = null;
          initCellElement(cell, row, column);
        });
      };
      this.rows['__handleElementRecycled'] = function (element, bindingContext) {
        withHijacksOf(element, bindingContext, function (cell, row, column, hijack) {
          hijack.element = cell;
          hijack.row = row;
          cell[HIJACKED_KEY] = hijack;
          initCellElement(cell, row, column);
          // TODO This update might have dependencies that won't get tracked.. (same below)
          updateCellElement(cell, row, column);
        });
      };
      var withHijacksOf = function (rowElement, bindingContext, action) {
        if (!hijackCount)
          return;
        var row = bindingContext['row']();
        var rowId = this.observableValueSelector(ko.unwrap(row[grid.primaryKey]));
        if (js.objects.hasOwn(hijacks, rowId)) {
          hijacks[rowId].forEach(function (hijack) {
            var column = hijack.column;
            var columnIndex = grid.columns.displayed().indexOf(column);
            var cell = rowElement.children[columnIndex];
            action(cell, row, column, hijack);
          });
        }
      }.bind(this);
      this.lookupCell = function (row, column) {
        var rowId = this.observableValueSelector(ko.unwrap(row[grid.primaryKey]));
        var rowIndex = this.rows.displayed().tryFirstIndexOf(row);
        var columnIndex = grid.columns.displayed().indexOf(column);
        var element = nthCellOfRow(nthRowElement(rowIndex), columnIndex);
        function hijack(override) {
          if (element[HIJACKED_KEY])
            throw new Error('Illegal state: This cell is already hijacked.');
          var binding = column._overrideValueBinding(override || function (b) {
            return b;
          }, {
            init: column._initCell || defaultInit,
            update: column._updateCell || defaultUpdate
          });
          var hijacked = element[HIJACKED_KEY] = {
            element: element,
            row: row,
            column: column,
            init: binding.init,
            update: binding.update
          };
          var rowHijacks = hijacks[rowId] = hijacks[rowId] || [];
          rowHijacks.push(hijacked);
          ++hijackCount;
          initCellElement(element, row, column);
          updateCellElement(element, row, column);
          function release() {
            if (rowHijacks.length === 1)
              delete hijacks[rowId];
            else
              rowHijacks.splice(rowHijacks.indexOf(hijacked), 1);
            --hijackCount;
            if (hijacked.element[HIJACKED_KEY] !== hijacked)
              return;
            // the element was recycled for another entry
            hijacked.element[HIJACKED_KEY] = null;
            initCellElement(hijacked.element, hijacked.row, hijacked.column);
            // TODO This update might have dependencies that won't get tracked.. (same above)
            updateCellElement(hijacked.element, hijacked.row, hijacked.column);
          }
          return js.objects.extend({
            release: release,
            dispose: release
          }, {
            'dispose': release,
            'release': release
          });
        }
        return js.objects.extend({
          element: element,
          hijack: hijack
        }, {
          'element': element,
          'hijack': hijack
        });
      }.bind(this);
      this['lookupCell'] = this.lookupCell;
      return function () {
      };
    }
    ko.bindingHandlers['__gridRow'] = {
      'init': function () {
      },
      'update': function (element, valueAccessor) {
        var value = valueAccessor();
        var classify = value['classify'];
        var row = value['row']();
        var index = value['index']();
        var coreClasses = index % 2 === 1 ? [
          'ko-grid-tr',
          'ko-grid-row',
          'alternate'
        ] : [
          'ko-grid-tr',
          'ko-grid-row'
        ];
        var additionalClasses = classify(row);
        var distinctClasses = coreClasses.concat(additionalClasses);
        element.className = distinctClasses.join(' ');
      }
    };
    ko.bindingHandlers['__gridCell'] = {
      'init': function (element, valueAccessor) {
        var value = valueAccessor();
        initCellElement(element, value['row'], value['column']());
        return { 'controlsDescendantBindings': true };
      },
      'update': function (element, valueAccessor) {
        var value = valueAccessor();
        var row = value['row']();
        var column = value['column'].peek();
        // can't change anyways => peek to keep dependency count low
        updateCellElement(element, row, column);
      }
    };
    function initCellElement(element, row, column) {
      var hijacked = element[HIJACKED_KEY];
      while (element.firstChild)
        ko.removeNode(element.firstChild);
      var init = hijacked && hijacked.init || column._initCell || defaultInit;
      init(element, row, column);
    }
    function updateCellElement(element, row, column) {
      var cell = row[column.property];
      var hijacked = element[HIJACKED_KEY];
      // TODO since there may be thousands of cells we want to keep the dependency count at two (row+cell) => peek => need separate change handler for cellClasses
      var columnClasses = column.cellClasses.peek().join(' ');
      element.className = 'ko-grid-td ko-grid-cell ' + columnClasses;
      var update = hijacked && hijacked.update || column._updateCell || defaultUpdate;
      update(element, cell, row, column);
    }
    function defaultInit(element) {
      element.insertBefore(document.createTextNode(''), element.firstChild);
    }
    function defaultUpdate(element, cell, row, column) {
      var child = element.firstChild;
      while (child.nodeType !== TEXT_NODE)
        child = child.nextSibling;
      child.nodeValue = column.renderValue(ko.unwrap(cell));
    }
    return data;
  }(knockout, onefold_js, stringifyable, ko_grid_application_event_dispatcher, text_ko_grid_datahtmltemplate);
  text_ko_grid_headershtmltemplate = '<thead class="ko-grid-thead" data-bind="_gridWidth: columns.combinedWidth() + \'px\'">\n    <!--before:headers-->\n    <tr class="ko-grid-tr ko-grid-headers"\n        data-bind="indexedRepeat: { forEach: headers.__rows, indexedBy: \'__rowId\', as: \'headerRow\' }"\n        data-repeat-bind="click: headers.__handleClick">\n\n        <th class="ko-grid-th"\n            data-bind="indexedRepeat: { forEach: headerRow(), indexedBy: \'id\', as: \'header\' }"\n            data-repeat-bind="__gridHeader: header"></th>\n    </tr>\n    <!--after:headers-->\n</thead>';
  ko_grid_headers = function (ko, js, ApplicationEventDispatcher, headersTemplate) {
    var document = window.document, Node = window.Node;
    function columnHeaderId(column) {
      return 'column-header-' + column.id;
    }
    var fallbackIdCounter = 0;
    function columnGroupHeaderId(columnGroup) {
      var id = columnGroup.id || '@__' + ++fallbackIdCounter;
      return 'column-group-header-' + id;
    }
    var headers = {
      init: function (template) {
        template.replace('head').with(headersTemplate);
      },
      Constructor: function (bindingValue, config, grid) {
        var invertedColumnGroups = invertColumnGroups(bindingValue['columnGroups'] || []);
        var columnGroupHeaders = {};
        var columnHeaders = {};
        var rows = [];
        this.__rows = ko.computed(function () {
          var displayedColumns = grid.columns.displayed();
          var maxDepth = 0;
          displayedColumns.forEach(function (column) {
            var group = invertedColumnGroups[column.id];
            maxDepth = Math.max(maxDepth, group ? group.depth + group.overallHeight : 0);
          });
          rows.length = maxDepth + 1;
          for (var i = 0; i < rows.length; ++i) {
            rows[i] = rows[i] || ko.observableArray();
            rows[i]['__rowId'] = 'header-row-' + i;
            rows[i].valueWillMutate();
            rows[i]().length = 0;
          }
          var open = [];
          displayedColumns.forEach(function (column) {
            var group = invertedColumnGroups[column.id];
            var depth = group ? group.depth + group.height : 0;
            open.length = depth;
            var header = reuseExisting(columnHeaders, new ColumnHeader(column));
            header.__reset(maxDepth - depth + 1);
            rows[depth]().push(header);
            var newColumnGroupHeaders = increaseColumnSpanOfOpenOrOpenNewColumnGroupHeaders(group, open, column);
            for (var j = 0; j < newColumnGroupHeaders.length; ++j) {
              if (newColumnGroupHeaders[j])
                rows[j]().push(newColumnGroupHeaders[j]);
            }
          });
          rows.forEach(function (row) {
            row.valueHasMutated();
          });
          return rows;
        });
        this['__rows'] = this.__rows;
        this.all = ko.computed(function () {
          var result = [];
          this.__rows().forEach(function (row) {
            Array.prototype.push.apply(result, row());
          });
          return result;
        }.bind(this));
        this['all'] = this.all;
        this.forColumn = function (column) {
          var id = columnHeaderId(column);
          if (!Object.prototype.hasOwnProperty.call(columnHeaders, id))
            throw new Error('Es existiert kein Header f\xFCr die gegebene Spalte.');
          return columnHeaders[id];
        };
        this['forColumn'] = this.forColumn;
        var onClickDispatcher = new ApplicationEventDispatcher(function (event, headerElement) {
          return [
            event,
            ko.contextFor(headerElement)['header']()
          ];
        });
        this['__handleClick'] = function (_, event) {
          onClickDispatcher.relativeToClosest('.ko-grid-column-header, .ko-grid-column-group-header').dispatch(event);
          return !event.defaultPrevented;
        };
        this.onHeaderClick = onClickDispatcher.registerHandler.bind(onClickDispatcher);
        this.onColumnHeaderClick = function (selectorOrHandler, handler) {
          var selectorSpecified = arguments.length > 1;
          handler = selectorSpecified ? handler : selectorOrHandler;
          var wrappedHandler = function (event, header) {
            if (header instanceof ColumnHeader)
              handler.apply(this, arguments);
          };
          onClickDispatcher.registerHandler.apply(onClickDispatcher, selectorSpecified ? [
            selectorOrHandler,
            wrappedHandler
          ] : [wrappedHandler]);
        };
        this['onHeaderClick'] = this.onHeaderClick;
        this['onColumnHeaderClick'] = this.onColumnHeaderClick;
        this._dispose = function () {
          this.__rows.dispose();
          this.all.dispose();
        }.bind(this);
        function increaseColumnSpanOfOpenOrOpenNewColumnGroupHeaders(group, open, column) {
          if (!group)
            return [];
          if (open[group.depth] && open[group.depth]._columnGroup === group)
            return increaseColumnSpanOfOpenColumnGroupHeaders(group, open, column);
          open.length = group.depth;
          var result = increaseColumnSpanOfOpenOrOpenNewColumnGroupHeaders(group.containingGroup, open, column);
          result[group.depth] = open[group.depth] = openNewColumnGroupHeader(group, column);
          return result;
        }
        function increaseColumnSpanOfOpenColumnGroupHeaders(group, open, column) {
          var containingGroup = group;
          do {
            var g = open[containingGroup.depth];
            g.columns.push(column);
            g.columnSpan(g.columnSpan() + 1);
            containingGroup = containingGroup.containingGroup;
          } while (containingGroup);
          return [];
        }
        function openNewColumnGroupHeader(group, column) {
          var columnGroupHeader = reuseExisting(columnGroupHeaders, new ColumnGroupHeader(group));
          columnGroupHeader.__reset(column);
          return columnGroupHeader;
        }
        function reuseExisting(pool, newInstance) {
          var id = newInstance.id;
          var pooledInstance = pool[id] = pool[id] || newInstance;
          return pooledInstance;
        }
      }
    };
    /** @constructor */
    function ColumnHeader(column) {
      this.id = columnHeaderId(column);
      this['id'] = this.id;
      this.element = ko.observable(null);
      this['element'] = this.element;
      this.rowSpan = ko.observable(1);
      this['rowSpan'] = this.rowSpan;
      this.columnSpan = ko.observable(1);
      this['columnSpan'] = this.columnSpan;
      this.label = column.label;
      this['label'] = this.label;
      this.column = column;
      this['column'] = this.column;
      this.columns = [column];
      this['columns'] = this.columns;
      this.__reset = function (rowSpan) {
        this.rowSpan(rowSpan);
      }.bind(this);
    }
    /** @constructor */
    function ColumnGroupHeader(columnGroup) {
      this.id = columnGroupHeaderId(columnGroup);
      this['id'] = this.id;
      this.element = ko.observable(null);
      this['element'] = this.element;
      this._columnGroup = columnGroup;
      this.rowSpan = ko.observable(columnGroup.height);
      this['rowSpan'] = this.rowSpan;
      this.columnSpan = ko.observable(1);
      this['columnSpan'] = this.columnSpan;
      this.label = ko.observable(columnGroup.label);
      this['label'] = this.label;
      this.columns = [];
      this['columns'] = this.columns;
      this.__reset = function (column) {
        this.columns = [column];
        this.columnSpan(1);
      }.bind(this);
    }
    function invertColumnGroups(columnGroups) {
      var result = {};
      function addTableEntries(invertedColumnGroup) {
        invertedColumnGroup.columnIds.forEach(function (id) {
          var columnGroup = result[id];
          if (!columnGroup)
            result[id] = invertedColumnGroup;
          else if (columnGroup !== invertedColumnGroup)
            throw new Error('Column `' + id + '` is element of column group `' + columnGroup.label + '` as well as `' + invertedColumnGroup.label + '`.');
        });
        if (invertedColumnGroup.containingGroup)
          addTableEntries(invertedColumnGroup.containingGroup);
      }
      js.arrays.flatMap(columnGroups, invertColumnGroup.bind(this, null)).forEach(function (g) {
        addTableEntries(g);
      });
      return result;
    }
    function invertColumnGroup(containingGroup, columnGroup) {
      var overallHeight = calculateOverallColumnGroupHeight(columnGroup);
      var subgroups = columnGroup.elements.filter(function (g) {
        return typeof g !== 'string';
      });
      var columnIds = columnGroup.elements.filter(function (g) {
        return typeof g === 'string';
      });
      var inverted = {
        id: columnGroup.id,
        label: columnGroup.label,
        containingGroup: containingGroup,
        depth: containingGroup ? containingGroup.depth + 1 : 0,
        height: containingGroup ? containingGroup.overallHeight - overallHeight : 1,
        overallHeight: overallHeight,
        columnIds: columnIds
      };
      return subgroups.length ? js.arrays.flatMap(subgroups, invertColumnGroup.bind(this, inverted)) : inverted;
    }
    function calculateOverallColumnGroupHeight(columnGroup) {
      var subgroups = columnGroup.elements.filter(function (g) {
        return typeof g !== 'string';
      });
      return 1 + Math.max.apply(Math, [0].concat(subgroups.map(calculateOverallColumnGroupHeight)));
    }
    ko.bindingHandlers['__gridHeader'] = {
      'init': function (element, valueAccessor) {
        var header = valueAccessor()();
        header.element(element);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
          header.element(null);
        });
        var child = element.firstChild;
        while (child) {
          var c = child;
          if (c.nodeType === Node.TEXT_NODE)
            ko.removeNode(c);
          child = child.nextSibling;
        }
        element.insertBefore(document.createTextNode(''), element.firstChild);
        return { 'controlsDescendantBindings': true };
      },
      'update': function (element, valueAccessor) {
        var header = valueAccessor()();
        var id = header.id.replace(/[\s]/g, '_');
        if (header.column) {
          element.className = 'ko-grid-th ko-grid-column-header ' + id + ' ' + header.column.headerClasses().join(' ');
        } else {
          element.className = 'ko-grid-th ko-grid-column-group-header ' + id;
        }
        var width = header.columns.map(function (c) {
          return c.widthInPixels();
        }).reduce(function (a, b) {
          return a + b;
        }) + 'px';
        element.style.width = width;
        element.style.maxWidth = width;
        element.rowSpan = header.rowSpan();
        element.colSpan = header.columnSpan();
        var child = element.firstChild;
        while (child.nodeType !== Node.TEXT_NODE)
          child = child.nextSibling;
        child.nodeValue = header.label();
      }
    };
    return headers;
  }(knockout, onefold_js, ko_grid_application_event_dispatcher, text_ko_grid_headershtmltemplate);
  ko_grid_layout = function (ko) {
    var document = window.document;
    var layout = {
      init: function () {
      },
      Constructor: function (bindingValue, config, grid) {
        var recalculating = ko.observable(false);
        var recalculate = function (configuration) {
          if (configuration)
            configuration();
        };
        this.recalculate = function (configuration) {
          recalculate(configuration);
        };
        this['recalculate'] = this.recalculate;
        var recalculateTrigger = ko.computed(function () {
          if (recalculating())
            return;
          grid.columns.displayed().forEach(function (c) {
            c.width();
          });
          recalculate();
        });
        var beforeRelayoutHandlers = [];
        var afterRelayoutHandlers = [];
        this.beforeRelayout = function (handler) {
          beforeRelayoutHandlers.push(handler);
        };
        this.afterRelayout = function (handler) {
          afterRelayoutHandlers.push(handler);
        };
        this['beforeRelayout'] = this.beforeRelayout;
        this['afterRelayout'] = this.afterRelayout;
        this._postApplyBindings = function () {
          initScolling.call(this, grid);
          recalculate = createLayoutRecalculator(grid, recalculating, beforeRelayoutHandlers, afterRelayoutHandlers);
          grid.postApplyBindings(recalculate);
        }.bind(this);
        // TODO let caller specify cell type (header cell vs. data cell vs. footer cell as well as other classes)
        this.determineCellDimensions = function (content) {
          var cell = document.createElement('div');
          cell.className = 'ko-grid-td ko-grid-cell';
          cell.appendChild(typeof content === 'string' ? document.createTextNode(content) : content);
          cell.style.position = 'absolute';
          cell.style.visibility = 'hidden';
          document.body.appendChild(cell);
          try {
            return {
              width: cell.offsetWidth,
              height: cell.offsetHeight
            };
          } finally {
            document.body.removeChild(cell);
          }
        };
        this['determineCellDimensions'] = this.determineCellDimensions;
        this._dispose = function () {
          recalculateTrigger.dispose();
        };
      }
    };
    var initScolling = function (grid) {
      var gridElement = grid.element;
      var scroller = gridElement.querySelector('.ko-grid-table-scroller');
      var thead = gridElement.querySelector('.ko-grid-thead');
      var tfoot = gridElement.querySelector('.ko-grid-tfoot');
      scroller.addEventListener('scroll', function () {
        var offset = -scroller.scrollLeft + 'px';
        thead.style.left = offset;
        tfoot.style.left = offset;
      });
    };
    var createLayoutRecalculator = function (grid, recalculating, beforeRelayoutHandlers, afterRelayoutHandlers) {
      var gridElement = grid.element;
      var spacer = gridElement.querySelector('.ko-grid-table-scroller-padding');
      var scroller = gridElement.querySelector('.ko-grid-table-scroller');
      var thead = gridElement.querySelector('.ko-grid-thead');
      var tfoot = gridElement.querySelector('.ko-grid-tfoot');
      var updateHeaderHeight = function (h) {
        spacer.style.borderTopWidth = Math.max(h, 0) + 'px';
      };
      var updateFooterHeight = function (h) {
        spacer.style.borderBottomWidth = Math.max(h, 0) + 'px';
      };
      var recalculationInProgress = false;
      return function (configuration) {
        if (recalculationInProgress)
          return;
        try {
          recalculating(recalculationInProgress = true);
          // TODO try for a nicer solution
          var scrollLeftBeforeRecalculation = scroller.scrollLeft;
          if (configuration)
            configuration();
          beforeRelayoutHandlers.forEach(function (h) {
            h.call(gridElement);
          });
          withElementLayedOut(gridElement, function () {
            updateHeaderHeight(thead.clientHeight);
            updateFooterHeight(tfoot.clientHeight);
          });
          scroller.scrollLeft = scrollLeftBeforeRecalculation;
          afterRelayoutHandlers.forEach(function (h) {
            h.call(gridElement);
          });
        } finally {
          recalculating(false);
          recalculationInProgress = false;
        }
      };
    };
    function withElementLayedOut(element, action) {
      // This is a quick check to see if the element is layed out.
      if (element.offsetWidth && element.offsetHeight)
        return action();
      var parent = element.parentNode;
      var placeholder = document.createComment('placeholder');
      parent.replaceChild(placeholder, element);
      var positionBackup = element.style.position;
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      document.body.appendChild(element);
      try {
        return action();
      } finally {
        parent.replaceChild(element, placeholder);
        element.style.position = positionBackup;
        element.style.visibility = 'visible';
      }
    }
    return layout;
  }(knockout);
  ko_grid_core = function (ko, columns, data, headers, layout) {
    var grid = ko.bindingHandlers['grid'] = ko.bindingHandlers['grid'] || {};
    var core = grid['core'] = grid['core'] || {
      'columns': columns,
      'data': data,
      'headers': headers,
      'layout': layout
    };
    return core;
  }(knockout, ko_grid_columns, ko_grid_data, ko_grid_headers, ko_grid_layout);
  ko_grid_extensions = function (ko, js) {
    var grid = ko.bindingHandlers['grid'] = ko.bindingHandlers['grid'] || {};
    var extensions = grid['extensions'] = grid['extensions'] || {};
    function registerExtension(extensionId, extension) {
      if (js.objects.hasOwn(extensions, extensionId))
        throw new Error('Extension id or alias already in use: `' + extensionId + '`.');
      extensions[extensionId] = extension;
      extension.__knownAliases.push(extensionId);
      return extension;
    }
    function lookUpExtension(extensionId) {
      if (!js.objects.hasOwn(extensions, extensionId))
        throw new Error('No known extension id or alias: `' + extensionId + '`.');
      return extensions[extensionId];
    }
    grid.defineExtension = function (name, spec) {
      return registerExtension(name, new GridExtension(name, spec));
    };
    grid.lookUpExtension = lookUpExtension;
    grid.declareExtensionAlias = function (alias, alreadyKnownAlias) {
      return registerExtension(alias, grid.lookUpExtension(alreadyKnownAlias));
    };
    grid.declareExtensionAliases = function (aliases, alreadyKnownAlias) {
      var extension = grid.lookUpExtension(alreadyKnownAlias);
      aliases.forEach(function (a) {
        return registerExtension(a, extension);
      });
      return extension;
    };
    /** @constructor */
    function GridExtension(primaryName, spec) {
      this.primaryName = primaryName;
      this.dependencies = spec.dependencies || [];
      this.initializer = spec.initializer || function () {
      };
      this.Constructor = spec.Constructor;
      this.__knownAliases = [];
    }
    GridExtension.prototype = {
      get knownAliases() {
        return this.__knownAliases.slice();
      },
      extractConfiguration: function (configurations, configName) {
        var usedAlias = this.__determineUsedAlias(configurations, function (presentAliases) {
          throw new Error('Conflicting configurations ' + presentAliases.map(function (c) {
            return '`' + c + '`';
          }).join(', ') + ' (configuration: `' + configName + '`).');
        });
        if (!usedAlias)
          throw new Error('The extension `' + this.primaryName + '` must be configured (configuration: `' + configName + '`)');
        return configurations[usedAlias];
      },
      tryExtractBindingValue: function (bindingValues) {
        var usedAlias = this.__determineUsedAlias(bindingValues, function (presentAliases) {
          throw new Error('Conflicting binding values ' + presentAliases.map(function (c) {
            return '`' + c + '`';
          }).join(', ') + '.');
        });
        return bindingValues[usedAlias];
      },
      __determineUsedAlias: function (object, dieDueToAmbiguity) {
        var presentAliases = this.__knownAliases.filter(function (a) {
          return js.objects.hasOwn(object, a);
        });
        if (presentAliases.length > 1)
          dieDueToAmbiguity(presentAliases);
        return presentAliases[0];
      }
    };
    return extensions;
  }(knockout, onefold_js);
  text_ko_grid_gridhtmltemplate = '<div class="ko-grid">\n    <!--before:grid-->\n    <div class="ko-grid-table-container">\n        <!--before:table-->\n        <div class="ko-grid-table-scroller-padding">\n            <div class="ko-grid-table-scroller">\n                <table class="ko-grid-table" data-bind="_gridWidth: columns.combinedWidth() + \'px\'">\n                    <!--columns-->\n                    <!--head-->\n                    <tfoot class="ko-grid-tfoot" data-bind="_gridWidth: columns.combinedWidth() + \'px\'"><!--tfoot--></tfoot>\n                    <!--body-->\n                </table>\n            </div>\n        </div>\n        <!--after:table-->\n    </div>\n    <!--after:grid-->\n</div>';
  ko_grid_binding = function (req, ko, js, ApplicationEventDispatcher) {
    var require = req;
    var document = window.document;
    var koGrid = ko.bindingHandlers['grid'] = ko.bindingHandlers['grid'] || {};
    var core = ko_grid_core;
    var extensions = ko_grid_extensions;
    var GridTemplate = ko_grid_template;
    var tableTemplate = text_ko_grid_gridhtmltemplate;
    var coreComponentNames = [
      'columns',
      'headers',
      'data',
      'layout'
    ];
    var coreComponents = coreComponentNames.map(function (n) {
      return core[n];
    });
    var templateEngine = new ko.nativeTemplateEngine();
    templateEngine.addTemplate = function (templateName, templateMarkup) {
      var template = document.createElement('script');
      template.id = templateName;
      template.type = 'text/html';
      template.text = templateMarkup;
      document.querySelector('head').appendChild(template);
    };
    /** @constructor */
    function Grid(rootElement, bindingValue) {
      this.bindingValue = bindingValue;
      this.primaryKey = bindingValue['primaryKey'];
      this['primaryKey'] = this.primaryKey;
      this.rootElement = rootElement;
      this['rootElement'] = rootElement;
      this.element = null;
      this['element'] = null;
      this._dispose = function () {
      };
      this.__postApplyBindings = function () {
      };
      this.postApplyBindings = function (callback) {
        if (!this.__postApplyBindings)
          throw new Error('Illegal state: postApplyBindings-callbacks have been called already.');
        var innerCallback = this.__postApplyBindings;
        this.__postApplyBindings = function () {
          innerCallback();
          callback();
        };
      }.bind(this);
      var onKeyDownDispatcher = new ApplicationEventDispatcher();
      this.onKeyDown = onKeyDownDispatcher.registerHandler.bind(onKeyDownDispatcher);
      this['onKeyDown '] = this.onKeyDown;
      rootElement.addEventListener('keydown', function (e) {
        onKeyDownDispatcher.relativeToClosest('.ko-grid').dispatch(e);
        return !e.defaultPrevented;
      });
    }
    ko.bindingHandlers['grid']['init'] = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var bindingValue = valueAccessor();
      var configName = bindingValue['config'];
      loadConfig(configName, function (config, templateName, extensionLoadOrder) {
        var disposeCallbacks = [];
        var grid = new Grid(element, bindingValue);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
          grid._dispose();
          disposeCallbacks.forEach(function (callback) {
            callback();
          });
        });
        js.objects.forEachProperty(core, function (componentName, component) {
          var instance = new component.Constructor(bindingValue, config, grid);
          grid[componentName] = instance;
          grid.columns = grid['columns'];
          grid.headers = grid['headers'];
          grid.data = grid['data'];
          grid.layout = grid['layout'];
          if (typeof instance._dispose === 'function')
            disposeCallbacks.push(instance._dispose.bind(instance));
        });
        var extensionConfigs = config['extensions'];
        var extensionBindingValues = bindingValue['extensions'] || {};
        var gridExtensions = grid['extensions'] = grid.extensions = {};
        extensionLoadOrder.forEach(function (extensionName) {
          var extension = koGrid.lookUpExtension(extensionName);
          var extensionBindingValue = extension.tryExtractBindingValue(extensionBindingValues) || {};
          var extensionConfig = apply(extension.extractConfiguration(extensionConfigs, configName), extensionBindingValue, bindingValue);
          if (extensionConfig['enabled'] === false && extensionBindingValue['enabled'] !== true || extensionBindingValue['enabled'] === false)
            return;
          extension.dependencies.forEach(function (dependency) {
            if (!gridExtensions[dependency])
              throw new Error('Dependency \'' + dependency + '\' was disabled.');
          });
          var instance = new extension.Constructor(extensionBindingValue, extensionConfig, grid, bindingValue, config);
          extension.knownAliases.forEach(function (alias) {
            gridExtensions[alias] = instance;
          });
          if (typeof instance.dispose === 'function')
            disposeCallbacks.push(instance.dispose.bind(instance));
        });
        while (element.firstChild)
          ko.removeNode(element.firstChild);
        var gridContext = bindingContext.createChildContext(grid, 'grid');
        ko.renderTemplate(templateName, gridContext, { 'templateEngine': templateEngine }, element);
        var gridElement = element.querySelector('.ko-grid');
        grid.element = gridElement;
        grid['element'] = gridElement;
        js.objects.forEachProperty(extensionConfigs, function (extensionName) {
          gridElement.className += ' with-' + js.strings.convertCamelToHyphenCase(extensionName);
        });
        coreComponentNames.forEach(function (n) {
          if (grid[n]._postApplyBindings)
            grid[n]._postApplyBindings();
        });
        grid.__postApplyBindings();
        grid.__postApplyBindings = null;
      });
      /**
       * @param {...*} config
       * @return {?}
       */
      function apply(config) {
        return typeof config === 'function' ? config.apply(undefined, Array.prototype.slice.call(arguments, 1)) : config;
      }
      return { 'controlsDescendantBindings': true };
    };
    ko.bindingHandlers['grid']['update'] = function () {
    };
    // TODO extract into own file
    var loadedConfigs = {};
    var loadConfig = function (configName, handler) {
      function callHandler() {
        var loadedConfig = loadedConfigs[configName];
        handler(loadedConfig.config, loadedConfig.templateName, loadedConfig.extensionLoadOrder);
      }
      if (loadedConfigs[configName])
        return callHandler();
      req([configName], function (config) {
        var template = new GridTemplate(tableTemplate);
        coreComponents.forEach(function (component) {
          component.init(template, config);
        });
        var extensionConfigs = config['extensions'];
        var loadedExtensions = [];
        var loadingExtensions = [];
        var loadExtension = function (extensionName) {
          var extension = koGrid.lookUpExtension(extensionName);
          var primaryExtensionName = extension.primaryName;
          var extensionConfig = extension.extractConfiguration(extensionConfigs, configName);
          if (js.arrays.contains(loadedExtensions, primaryExtensionName))
            return;
          if (js.arrays.contains(loadingExtensions, primaryExtensionName))
            throw new Error('Dependency-Cycle: .. -> ' + loadingExtensions.join(' -> ') + ' -> ' + primaryExtensionName + ' -> ..');
          loadingExtensions.push(primaryExtensionName);
          extension.dependencies.forEach(loadExtension);
          extension.initializer(template, extensionConfig, config);
          if (loadingExtensions.pop() !== primaryExtensionName)
            throw new Error('Assertion error.');
          loadedExtensions.push(primaryExtensionName);
        };
        Object.keys(extensionConfigs).forEach(loadExtension);
        var templateName = 'ko-grid-template-' + configName;
        templateEngine.addTemplate(templateName, template.build());
        loadedConfigs[configName] = {
          config: config,
          templateName: templateName,
          extensionLoadOrder: loadedExtensions
        };
        callHandler();
      });
    };
    ko.bindingHandlers['_gridWidth'] = {
      'init': function () {
      },
      'update': function (element, valueAccessor) {
        var w = valueAccessor();
        element.style.width = w;
        element.style.maxWidth = w;
      }
    };
    return koGrid;
  }(req, knockout, onefold_js, ko_grid_application_event_dispatcher);
  ko_grid = function (main) {
    return main;
  }(ko_grid_binding);
  return ko_grid;
}(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_aggregate = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_aggregate_aggregate, ko_grid_aggregate;
  ko_grid_aggregate_aggregate = function (module, ko, koGrid) {
    var extensionId = 'ko-grid-aggregate'.substr(0, 'ko-grid-aggregate'.indexOf('/')).substr(0, 'ko-grid-aggregate'.indexOf('/'));
    function renderNumber(value) {
      if (Math.abs(value) >= 1)
        return value.toLocaleString();
      else {
        var firstNonZeroFractionDigit = -Math.floor(Math.log(value) / Math.log(10));
        return value.toLocaleString(undefined, { maximumFractionDigits: firstNonZeroFractionDigit + 1 });
      }
    }
    koGrid.defineExtension(extensionId, {
      initializer: function (template) {
        template.to('tfoot').prepend('aggregates', [
          '<tr class="ko-grid-tr ko-grid-aggregate-row" data-bind="indexedRepeat: {',
          '  forEach: extensions.aggregate.__aggregateRows,',
          '  indexedBy: \'id\',',
          '  as: \'aggregateRow\'',
          '}">',
          '  <td class="ko-grid-tf ko-grid-aggregate"',
          '    data-bind="indexedRepeat: {',
          '      forEach: columns.displayed,',
          '      indexedBy: \'id\',',
          '      as: \'column\'',
          '    }"',
          '    data-repeat-bind="',
          '      __gridAggregate: aggregateRow()[column().id],',
          '      _gridWidth: column().width()',
          '"></td>',
          '</tr>'
        ].join(''));
      },
      Constructor: function AggregateExtension(bindingValue, config, grid) {
        var aggregateRows = ko.observable([]);
        this['__aggregateRows'] = aggregateRows;
        if (!Array.isArray(bindingValue))
          return;
        var propertiesOfInterest = [];
        bindingValue.forEach(function (aggregates) {
          Object.keys(aggregates).forEach(function (columnId) {
            var property = grid.columns.byId(columnId).property;
            if (propertiesOfInterest.indexOf(property) < 0)
              propertiesOfInterest.push(property);
          });
        });
        var computeStatistics = config['statisticsComputer'] || computeStatisticsFromValuesStream;
        var idCounter = 0;
        var computer = ko.computed(function () {
          grid.data.predicate();
          grid.data.view.values();
          return computeStatistics(grid, propertiesOfInterest).then(function (statistics) {
            var count = statistics.count;
            aggregateRows(bindingValue.map(function (aggregates) {
              var row = { id: '' + ++idCounter };
              grid.columns.displayed().forEach(function (column) {
                var columnId = column.id;
                var property = column.property;
                var aggregate = aggregates[columnId];
                if (aggregate) {
                  // TODO support date and perhaps other types
                  row[columnId] = {
                    column: column,
                    aggregate: aggregate,
                    value: count ? renderNumber(aggregate === 'average' ? statistics[property]['sum'] / count : statistics[property][aggregate]) : 'N/A'
                  };
                } else {
                  row[columnId] = { column: column };
                }
              });
              return row;
            }));
            grid.layout.recalculate();
          });
        });
        this.dispose = function () {
          computer.dispose();
        };
      }
    });
    var computeStatisticsFromValuesStream = function (grid, propertiesOfInterest) {
      return grid.data.source.streamValues(function (q) {
        return q.filteredBy(grid.data.predicate);
      }).then(function (values) {
        var statistics = { count: 0 };
        propertiesOfInterest.forEach(function (p) {
          statistics[p] = {
            'minimum': Number.POSITIVE_INFINITY,
            'maximum': Number.NEGATIVE_INFINITY,
            'sum': 0
          };
        });
        return values.reduce(function (_, value) {
          ++statistics.count;
          propertiesOfInterest.forEach(function (p) {
            var propertyStatistics = statistics[p];
            var v = grid.data.valueSelector(value[p]);
            propertyStatistics['minimum'] = Math.min(propertyStatistics['minimum'], v);
            propertyStatistics['maximum'] = Math.max(propertyStatistics['maximum'], v);
            propertyStatistics['sum'] += v;
          });
          return _;
        }, statistics);
      });
    };
    ko.bindingHandlers['__gridAggregate'] = {
      'init': function (element) {
        while (element.firstChild)
          ko.removeNode(element.firstChild);
        element.appendChild(window.document.createTextNode(''));
        return { 'controlsDescendantBindings': true };
      },
      'update': function (element, valueAccessor) {
        var value = valueAccessor();
        element.className = ['ko-grid-tf ko-grid-aggregate' + (value.aggregate ? ' ' + value.aggregate : '')].concat(value.column.footerClasses()).join(' ');
        element.firstChild.nodeValue = value.aggregate ? value.value : '';
      }
    };
    return koGrid.declareExtensionAlias('aggregate', extensionId);
  }({}, knockout, ko_grid);
  ko_grid_aggregate = function (main) {
    return main;
  }(ko_grid_aggregate_aggregate);
  return ko_grid_aggregate;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_cell_navigation = function (onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_cell_navigation_cell_navigation, ko_grid_cell_navigation;
  ko_grid_cell_navigation_cell_navigation = function (module, ko, koGrid) {
    var extensionId = 'ko-grid-cell-navigation'.indexOf('/') < 0 ? 'ko-grid-cell-navigation' : 'ko-grid-cell-navigation'.substring(0, 'ko-grid-cell-navigation'.indexOf('/'));
    var KEY_CODE_ARROW_UP = 38, KEY_CODE_ARROW_LEFT = 37, KEY_CODE_ARROW_RIGHT = 39, KEY_CODE_ARROW_DOWN = 40, KEY_CODE_TAB = 9, KEY_CODE_ENTER = 13;
    var KEY_CODES = [
      KEY_CODE_ARROW_UP,
      KEY_CODE_ARROW_LEFT,
      KEY_CODE_ARROW_RIGHT,
      KEY_CODE_ARROW_DOWN,
      KEY_CODE_TAB,
      KEY_CODE_ENTER
    ];
    koGrid.defineExtension(extensionId, {
      initializer: function (template) {
        template.before('table').insert('<textarea class="ko-grid-focus-parking" tabIndex="-1" style="position: absolute; z-index: 10; overflow: hidden; box-sizing: border-box; width: 1em; height: 1em; top: -3em; left: -3em; resize: none; border: none;"></textarea>');
      },
      Constructor: function CellNavigationExtension(bindingValue, config, grid) {
        var onCellFocusedHandlers = [];
        this.onCellFocused = function (handler) {
          return onCellFocusedHandlers.push(handler);
        };
        this['onCellFocused'] = this.onCellFocused;
        var scroller = null, focusParking = null, selectedRow = null, selectedColumn = null, hijacked = null;
        grid.postApplyBindings(function () {
          scroller = grid.element.querySelector('.ko-grid-table-scroller');
          focusParking = grid.element.querySelector('.ko-grid-focus-parking');
        });
        grid.data.onCellClick(function (e, cellValue, row, column) {
          return focus(row, column);
        });
        grid.onKeyDown(function (e) {
          if (e.defaultPrevented || KEY_CODES.indexOf(e.keyCode) < 0)
            return;
          e.preventDefault();
          var multiplier = e.shiftKey ? -1 : 1;
          switch (e.keyCode) {
          case KEY_CODE_ARROW_UP:
            return move(-1, 0);
          case KEY_CODE_ARROW_LEFT:
            return move(0, -1);
          case KEY_CODE_ARROW_RIGHT:
            return move(0, 1);
          case KEY_CODE_ARROW_DOWN:
            return move(1, 0);
          case KEY_CODE_TAB:
            return move(0, multiplier, true);
          case KEY_CODE_ENTER:
            return move(multiplier, 0);
          }
        });
        /**
         * @param {number} rowWise
         * @param {number} columnWise
         * @param {boolean=} wrap
         */
        function move(rowWise, columnWise, wrap) {
          wrap = !!wrap;
          var rows = grid.data.rows.displayed();
          var cols = grid.columns.displayed();
          var rowIndex = rows.tryFirstIndexOf(selectedRow);
          var colIndex = cols.indexOf(selectedColumn);
          var newRowIndex = rowIndex + rowWise;
          var newColIndex = colIndex + columnWise;
          if (wrap && newColIndex < 0) {
            newRowIndex -= 1;
            newColIndex = cols.length - 1;
          } else if (wrap && newColIndex >= cols.length) {
            newRowIndex += 1;
            newColIndex = 0;
          }
          newColIndex = Math.max(0, Math.min(cols.length - 1, newColIndex));
          newRowIndex = Math.max(0, Math.min(rows.length - 1, newRowIndex));
          focus(rows.get(newRowIndex), cols[newColIndex]);
        }
        function focus(row, column) {
          if (row === selectedRow && column === selectedColumn)
            return;
          if (hijacked)
            hijacked.release();
          var cell = grid.data.lookupCell(row, column);
          focusParking.focus();
          focusParking.value = column.renderValue(ko.unwrap(row[column.property]));
          focusParking.setSelectionRange(0, focusParking.value.length);
          hijacked = cell.hijack(function (b) {
            return onCellFocusedHandlers.reduce(function (a, h) {
              return h(row, column, a) || a;
            }, {
              init: function (element, row, column) {
                var $__arguments = arguments;
                selectedRow = row;
                selectedColumn = column;
                b.init.apply(this, $__arguments);
                element.classList.add('focused');
              },
              update: function (element) {
                var $__arguments = arguments;
                b.update.apply(this, $__arguments);
                element.classList.add('focused');
              }
            });
          });
          scrollIntoView(cell.element);
        }
        // TODO scroll containing view port if necessary
        function scrollIntoView(element) {
          var scrollerBounds = scroller.getBoundingClientRect();
          var elementBounds = element.getBoundingClientRect();
          var extra = 7;
          var scrollX = Math.min(0, elementBounds.left - scrollerBounds.left - extra) || Math.max(0, elementBounds.right - scrollerBounds.right + extra + (scroller.offsetWidth - scroller.clientWidth));
          var scrollY = Math.min(0, elementBounds.top - scrollerBounds.top - extra) || Math.max(0, elementBounds.bottom - scrollerBounds.bottom + extra);
          scroller.scrollLeft += scrollX;
          scroller.scrollTop += scrollY;
        }
      }
    });
    return koGrid.declareExtensionAlias('cellNavigation', extensionId);
  }({}, knockout, ko_grid);
  ko_grid_cell_navigation = function (main) {
    return main;
  }(ko_grid_cell_navigation_cell_navigation);
  return ko_grid_cell_navigation;
}(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_column_sizing = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_column_sizing_column_sizing, ko_grid_column_sizing;
  ko_grid_column_sizing_column_sizing = function (module, koGrid) {
    var extensionId = 'ko-grid-column-sizing'.indexOf('/') < 0 ? 'ko-grid-column-sizing' : 'ko-grid-column-sizing'.substring(0, 'ko-grid-column-sizing'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      Constructor: function ColumnSizingExtension() {
        this.isResizable = function (column) {
          return column.userDefined;
        };
        this['isResizable'] = this.isResizable;
      }
    });
    return koGrid.declareExtensionAlias('columnSizing', extensionId);
  }({}, ko_grid);
  ko_grid_column_sizing = function (main) {
    return main;
  }(ko_grid_column_sizing_column_sizing);
  return ko_grid_column_sizing;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_column_resizing = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
  var ko_grid_column_resizing_column_resizing, ko_grid_column_resizing;
  var columnSizing = 'ko-grid-column-sizing';
  ko_grid_column_resizing_column_resizing = function (module, ko, dom, koGrid) {
    var extensionId = 'ko-grid-column-resizing'.indexOf('/') < 0 ? 'ko-grid-column-resizing' : 'ko-grid-column-resizing'.substring(0, 'ko-grid-column-resizing'.indexOf('/'));
    var MINIMAL_COLUMN_WIDTH = 10;
    var document = window.document, requestAnimationFrame = window.requestAnimationFrame.bind(window), cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
    koGrid.defineExtension(extensionId, {
      dependencies: [columnSizing],
      Constructor: function ColumnResizingExtension(bindingValue, config, grid) {
        var isResizable = grid.extensions[columnSizing].isResizable;
        var perHeaderSubscriptions = {};
        var insertResizers = function (headers) {
          headers.forEach(function (header) {
            if (!perHeaderSubscriptions[header.id] && header.columns.filter(isResizable).length) {
              perHeaderSubscriptions[header.id] = header.element.subscribe(function (element) {
                if (element) {
                  var resizer = document.createElement('div');
                  resizer.classList.add('ko-grid-column-resizer');
                  element.appendChild(resizer);
                }
              });
            }
          });
        };
        var headersSubscription = grid.headers.all.subscribe(insertResizers);
        insertResizers(grid.headers.all());
        var resizeInProgress = false;
        this.isResizeInProgress = function () {
          return resizeInProgress;
        };
        this['isResizeInProgress'] = this.isResizeInProgress;
        grid.rootElement.addEventListener('mousedown', function (e) {
          if (!dom.element.matches(e.target, '.ko-grid-column-resizer'))
            return;
          e.preventDefault();
          var overlay = document.createElement('div');
          overlay.id = 'ko-grid-column-resize-in-progress';
          document.body.appendChild(overlay);
          e.target.classList.add('active');
          resizeInProgress = true;
          var header = ko.contextFor(e.target)['header']();
          var columns = header.columns.filter(isResizable);
          var initialCombinedWidth = 0;
          var columnWidthFactors = [];
          for (var i = columns.length - 1; i >= 0; --i) {
            var columnWidth = columns[i].widthInPixels();
            initialCombinedWidth += columnWidth;
            columnWidthFactors.unshift(columnWidth / initialCombinedWidth);
          }
          var initialMousePosition = e.pageX;
          var newMousePosition = initialMousePosition;
          var animationFrameRequest = null;
          function adjustWidths() {
            var newCombinedWidth = initialCombinedWidth + newMousePosition - initialMousePosition;
            newCombinedWidth = Math.max(0, newCombinedWidth - columns.length * MINIMAL_COLUMN_WIDTH);
            for (var i = 0; i < columns.length; ++i) {
              var share = Math.round(columnWidthFactors[i] * newCombinedWidth);
              columns[i].width(MINIMAL_COLUMN_WIDTH + share + 'px');
              newCombinedWidth -= share;
            }
          }
          function onMouseMove(e2) {
            newMousePosition = e2.pageX;
            if (animationFrameRequest)
              cancelAnimationFrame(animationFrameRequest);
            animationFrameRequest = requestAnimationFrame(adjustWidths);
            e.preventDefault();
          }
          function onMouseUp() {
            if (animationFrameRequest)
              cancelAnimationFrame(animationFrameRequest);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.removeChild(overlay);
            e.target.classList.remove('active');
            resizeInProgress = false;
            grid.layout.recalculate();
          }
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }, true);
        grid.rootElement.addEventListener('click', function (e) {
          if (dom.element.matches(e.target, '.ko-grid-column-resizer'))
            e.preventDefault();
        }, true);
        this.dispose = function () {
          headersSubscription.dispose();
          Object.keys(perHeaderSubscriptions).forEach(function (k) {
            perHeaderSubscriptions[k].dispose();
          });
        };
      }
    });
    return koGrid.declareExtensionAlias('columnResizing', extensionId);
  }({}, knockout, onefold_dom, ko_grid);
  ko_grid_column_resizing = function (main) {
    return main;
  }(ko_grid_column_resizing_column_resizing);
  return ko_grid_column_resizing;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_data_source, ko_indexed_repeat, ko_grid, knockout);
ko_grid_view_modes = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_view_modes_view_modes, ko_grid_view_modes;
  ko_grid_view_modes_view_modes = function (module, ko, js, koGrid) {
    var extensionId = 'ko-grid-view-modes'.indexOf('/') < 0 ? 'ko-grid-view-modes' : 'ko-grid-view-modes'.substring(0, 'ko-grid-view-modes'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      Constructor: function ViewModesExtension(bindingValue, config, grid) {
        var toggleModeActivityTo = function (active) {
          return function (modeOrModes, configuration) {
            var modes = typeof modeOrModes === 'string' ? [modeOrModes] : js.arrays.distinct(modeOrModes);
            var activeModesUnderlying = this.activeModes();
            modes.forEach(function (m) {
              if (js.arrays.contains(activeModesUnderlying, m) === active)
                throw new Error('Mode `' + m + '` is already ' + (active ? 'active' : 'inactive') + '.');
            });
            grid.layout.recalculate(function () {
              this.activeModes.valueWillMutate();
              var classList = grid.element.classList;
              if (active) {
                Array.prototype.push.apply(activeModesUnderlying, modes);
                classList.add.apply(classList, modes);
              } else {
                var otherModes = activeModesUnderlying.filter(function (m) {
                  return !js.arrays.contains(modes, m);
                });
                activeModesUnderlying.length = 0;
                Array.prototype.push.apply(activeModesUnderlying, otherModes);
                classList.remove.apply(classList, modes);
              }
              activeModesUnderlying.sort();
              if (configuration)
                configuration();
              this.activeModes.valueHasMutated();
            }.bind(this));
          }.bind(this);
        }.bind(this);
        this.activeModes = ko.observableArray([]);
        this.enter = toggleModeActivityTo(true);
        this.leave = toggleModeActivityTo(false);
        this['activeModes'] = this.activeModes;
        this['enver'] = this.enter;
        this['leave'] = this.leave;
      }
    });
    return koGrid.declareExtensionAlias('viewModes', extensionId);
  }({}, knockout, onefold_js, ko_grid);
  ko_grid_view_modes = function (main) {
    return main;
  }(ko_grid_view_modes_view_modes);
  return ko_grid_view_modes;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_view_state_storage = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
  var ko_grid_view_state_storage_view_state_storage, ko_grid_view_state_storage;
  var viewModes = 'ko-grid-view-modes';
  ko_grid_view_state_storage_view_state_storage = function (module, js, koGrid) {
    var extensionId = 'ko-grid-view-state-storage'.indexOf('/') < 0 ? 'ko-grid-view-state-storage' : 'ko-grid-view-state-storage'.substring(0, 'ko-grid-view-state-storage'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      dependencies: [viewModes],
      Constructor: function ViewStateStorageExtension(bindingValue, config, grid) {
        var self = this;
        // TODO hash the data-bind attribute if no id is present?
        var gridPrefix = 'koGrid.' + js.strings.convertHyphenToCamelCase(grid.rootElement.id);
        var basicKeyValueStore = config['keyValueStore'] || new LocalStorageKeyValueStore();
        var inModeTransition = false;
        self.modeIndependent = new BindableKeyValueStore(basicKeyValueStore, function () {
          return gridPrefix;
        }, function () {
          return false;
        });
        self.modeDependent = new BindableKeyValueStore(basicKeyValueStore, function () {
          return gridPrefix + '[' + grid.extensions[viewModes].activeModes().join(';') + ']';
        }, function () {
          return inModeTransition;
        });
        var activeModesWillChangeSubscription = grid.extensions[viewModes].activeModes.subscribe(function () {
          inModeTransition = true;
        }, null, 'beforeChange');
        var activeModesHaveChangedSubscription = grid.extensions[viewModes].activeModes.subscribe(function () {
          inModeTransition = false;
          self.modeDependent.__synchronizeBindings();
        });
        grid.postApplyBindings(function () {
          return [
            self.modeIndependent,
            self.modeDependent
          ].forEach(function (bs) {
            return bs.__synchronizeBindings();
          });
        });
        self.dispose = function () {
          activeModesWillChangeSubscription.dispose();
          activeModesHaveChangedSubscription.dispose();
          [
            self.modeIndependent,
            self.modeDependent
          ].forEach(function (bs) {
            return bs.__clearBindings();
          });
        };
      }
    });
    return koGrid.declareExtensionAlias('viewStateStorage', extensionId);
    /**
     * @constructor
     * @extends de.benshu.ko.grid.extensions.viewStateStorage.BindableKeyValueStore
     *
     * @param {de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore} keyValueStorage
     * @param {function():string} prefixProvider
     * @param {function():boolean} inModeTransition
     */
    function BindableKeyValueStore(keyValueStorage, prefixProvider, inModeTransition) {
      var prefixed = function (key) {
        return prefixProvider() + '.' + key;
      };
      var bindings = {};
      this.read = function (key) {
        return keyValueStorage.read(prefixed(key));
      };
      this.write = function (key, value) {
        return keyValueStorage.write(prefixed(key), value);
      };
      this.bind = function (key, observable) {
        if (js.objects.hasOwn(bindings, key))
          throw new Error('The key `' + key + '` is already bound.');
        var subscription = observable.subscribe(function (newValue) {
          if (!inModeTransition())
            this.write(key, newValue);
        }.bind(this));
        var binding = bindings[key] = {
          __synchronize: function () {
            var storedValue = this.read(key);
            if (storedValue === undefined)
              this.write(key, observable());
            else
              observable(storedValue);
          }.bind(this),
          key: key,
          observable: observable,
          dispose: function () {
            subscription.dispose();
            delete bindings[key];
          }
        };
        binding.__synchronize();
        return binding;
      }.bind(this);
      this.__synchronizeBindings = function () {
        js.objects.forEachProperty(bindings, function (key, binding) {
          binding.__synchronize();
        });
      };
      this.__clearBindings = function () {
        js.objects.forEachProperty(bindings, function (key, binding) {
          binding.dispose();
          delete bindings[key];
        });
      };
    }
    /**
     * @constructor
     * @extends de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore
     */
    function LocalStorageKeyValueStore() {
      this.read = function (key) {
        var stored = window.localStorage.getItem(key);
        return stored === null ? undefined : JSON.parse(stored);
      };
      this.write = function (key, value) {
        if (value !== undefined)
          window.localStorage.setItem(key, JSON.stringify(value));
      };
    }
  }({}, onefold_js, ko_grid);
  ko_grid_view_state_storage = function (main) {
    return main;
  }(ko_grid_view_state_storage_view_state_storage);
  return ko_grid_view_state_storage;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout);
ko_grid_column_scaling = function (stringifyable, onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_resizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_column_sizing, ko_grid_view_modes, knockout, ko_grid) {
  var ko_grid_column_scaling_column_scaling, ko_grid_column_scaling;
  var columnSizing = 'ko-grid-column-sizing';
  var viewStateStorage = 'ko-grid-view-state-storage';
  var columnResizing = 'ko-grid-column-resizing';
  ko_grid_column_scaling_column_scaling = function (module, ko, js, koGrid) {
    var extensionId = 'ko-grid-column-scaling'.indexOf('/') < 0 ? 'ko-grid-column-scaling' : 'ko-grid-column-scaling'.substring(0, 'ko-grid-column-scaling'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      dependencies: [
        viewStateStorage,
        columnSizing
      ],
      Constructor: function ColumnScalingExtension(bindingValue, config, grid) {
        var borrowedPixels = ko.observable({});
        grid.extensions[viewStateStorage].modeDependent.bind('borrowedPixels', borrowedPixels);
        var isResizable = grid.extensions[columnSizing].isResizable;
        var isSameWidthAsPreviously = function (column) {
          var entry = borrowedPixels()[column.id];
          return entry && entry.width + entry.borrowed === column.widthInPixels();
        };
        grid.layout.beforeRelayout(function () {
          if (grid.extensions[columnResizing] && grid.extensions[columnResizing].isResizeInProgress())
            return;
          var gridWidth = this.querySelector('.ko-grid-table-scroller').clientWidth;
          var combinedColumnWidth = grid.columns.combinedWidth();
          var returnablePixels = 0;
          grid.columns.displayed().forEach(function (c) {
            returnablePixels += isSameWidthAsPreviously(c) ? borrowedPixels()[c.id].borrowed : 0;
          });
          if (gridWidth > combinedColumnWidth || gridWidth < combinedColumnWidth && returnablePixels)
            redistributeExtraPixels(gridWidth);
        });
        var redistributeExtraPixels = function (gridWidth) {
          var newDistribution = determineAppropriateDistributionOfExtraPixels(gridWidth);
          js.objects.forEachProperty(newDistribution, function (columnId, value) {
            var column = grid.columns.byId(columnId);
            column.width(value.width + value.borrowed + 'px');
          });
          borrowedPixels(newDistribution);
        };
        var determineAppropriateDistributionOfExtraPixels = function (gridWidth) {
          var displayedColumns = grid.columns.displayed();
          var baseCombinedColumnWidthOfAll = 0;
          var baseCombinedColumnWidthOfUnchanged = 0;
          var nonScalingWidth = 0;
          var baseDistribution = {};
          displayedColumns.forEach(function (c) {
            var resizable = isResizable(c);
            var w;
            if (resizable && isSameWidthAsPreviously(c)) {
              w = borrowedPixels()[c.id].width;
              baseCombinedColumnWidthOfUnchanged += w;
            } else {
              w = c.widthInPixels();
              nonScalingWidth += resizable ? 0 : w;
            }
            baseCombinedColumnWidthOfAll += w;
            baseDistribution[c.id] = {
              width: w,
              borrowed: 0
            };
          });
          var baseCombinedColumnWidth = baseCombinedColumnWidthOfUnchanged || baseCombinedColumnWidthOfAll - nonScalingWidth;
          if (baseCombinedColumnWidthOfAll >= gridWidth)
            return baseDistribution;
          var remainingSparePixels = gridWidth - baseCombinedColumnWidthOfAll;
          var scale = baseCombinedColumnWidth;
          return js.objects.mapProperties(baseDistribution, function (value, columnId) {
            var column = grid.columns.byId(columnId);
            if (!isResizable(column) || baseCombinedColumnWidthOfUnchanged && !isSameWidthAsPreviously(column))
              return value;
            var share = Math.round(value.width / scale * remainingSparePixels);
            remainingSparePixels -= share;
            scale -= value.width;
            return {
              width: value.width,
              borrowed: share
            };
          });
        };
      }
    });
    return koGrid.declareExtensionAlias('columnScaling', extensionId);
  }({}, knockout, onefold_js, ko_grid);
  ko_grid_column_scaling = function (main) {
    return main;
  }(ko_grid_column_scaling_column_scaling);
  return ko_grid_column_scaling;
}(stringifyable, onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_resizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_column_sizing, ko_grid_view_modes, knockout, ko_grid);
ko_grid_column_width_persistence = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid) {
  var ko_grid_column_width_persistence_column_width_persistence, ko_grid_column_width_persistence;
  var columnSizing = 'ko-grid-column-sizing';
  var viewStateStorage = 'ko-grid-view-state-storage';
  ko_grid_column_width_persistence_column_width_persistence = function (module, js, koGrid) {
    var extensionId = 'ko-grid-column-width-persistence'.indexOf('/') < 0 ? 'ko-grid-column-width-persistence' : 'ko-grid-column-width-persistence'.substring(0, 'ko-grid-column-width-persistence'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      dependencies: [
        viewStateStorage,
        columnSizing
      ],
      Constructor: function ColumnWidthPersistenceExtension(bindingValue, config, grid) {
        var self = this;
        var modeDependentStorage = grid.extensions[viewStateStorage].modeDependent;
        var isResizable = grid.extensions[columnSizing].isResizable;
        var boundOrNonResizable = {};
        var bindWidthsOf = function (columns) {
          return columns.filter(function (c) {
            return !js.objects.hasOwn(boundOrNonResizable, c.key);
          }).forEach(function (c) {
            boundOrNonResizable[c.key] = true;
            if (isResizable(c))
              modeDependentStorage.bind('column[' + c.id + '].width', c.width);
          });
        };
        var subscription = grid.columns.all.subscribe(bindWidthsOf);
        bindWidthsOf(grid.columns.all());
        self.dispose = function () {
          subscription.dispose();
        };
      }
    });
    return koGrid.declareExtensionAlias('columnWidthPersistence', extensionId);
  }({}, onefold_js, ko_grid);
  ko_grid_column_width_persistence = function (main) {
    return main;
  }(ko_grid_column_width_persistence_column_width_persistence);
  return ko_grid_column_width_persistence;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid);
ko_grid_editing = function (onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid_cell_navigation, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
  var ko_grid_editing_editing, ko_grid_editing;
  var cellNavigation = 'ko-grid-cell-navigation';
  ko_grid_editing_editing = function (module, ko, koGrid) {
    var extensionId = 'ko-grid-editing'.indexOf('/') < 0 ? 'ko-grid-editing' : 'ko-grid-editing'.substring(0, 'ko-grid-editing'.indexOf('/'));
    var HIDDEN_TOP = '0', HIDDEN_LEFT = '-8px', HIDDEN_RIGHT = '', HIDDEN_BOTTOM = '0', HIDDEN_WIDTH = '7px', VISIBLE_TOP = '0', VISIBLE_LEFT = '0', VISIBLE_RIGHT = '0', VISIBLE_BOTTOM = '0', VISIBLE_WIDTH = '';
    var KEY_CODE_TAB = 9, KEY_CODE_ENTER = 13, KEY_CODE_SHIFT = 16, KEY_CODE_ESCAPE = 27, KEY_CODE_ARROW_LEFT = 37, KEY_CODE_ARROW_DOWN = 40, KEY_CODE_F1 = 112, KEY_CODE_F2 = 113, KEY_CODE_F3 = 114, KEY_CODE_F12 = 123;
    var ACTIVATED_START_INDEX = 4, PASS_THROUGH_KEY_RANGES = [
        [
          KEY_CODE_ARROW_LEFT,
          KEY_CODE_ARROW_DOWN
        ],
        [
          KEY_CODE_TAB,
          KEY_CODE_TAB
        ],
        [
          KEY_CODE_ENTER,
          KEY_CODE_ENTER
        ],
        [
          KEY_CODE_ESCAPE,
          KEY_CODE_ESCAPE
        ],
        [
          KEY_CODE_SHIFT,
          KEY_CODE_SHIFT
        ],
        [
          KEY_CODE_F1,
          KEY_CODE_F1
        ],
        [
          KEY_CODE_F3,
          KEY_CODE_F12
        ],
        [
          KEY_CODE_F2,
          KEY_CODE_F2
        ]
      ], PRE_ACTIVATION_END_INDEX = PASS_THROUGH_KEY_RANGES.length - 1;
    koGrid.defineExtension(extensionId, {
      dependencies: [cellNavigation],
      Constructor: function EditingExtension(bindingValue, config, grid) {
        var createEditor = bindingValue['createEditor'] || config['createEditor'] || function () {
            return null;
          }, saveChange = bindingValue['saveChange'] || config['saveChange'] || function () {
            return window.console.warn('No `saveChange` strategy provided.');
          };
        var editingRow = null, editingColumn = null, editorContainer = null, editor = null, activated = false, keyDownSubscription = {
            dispose: function () {
            }
          };
        grid.data.onCellDoubleClick(function () {
          if (editor) {
            activate();
            editor.activate();
          }
        });
        grid.extensions[cellNavigation].onCellFocused(function (row, column, binding) {
          keyDownSubscription.dispose();
          editorContainer = window.document.createElement('div');
          editorContainer.style.position = 'absolute';
          editorContainer.style.top = HIDDEN_TOP;
          editorContainer.style.left = HIDDEN_LEFT;
          editorContainer.style.right = HIDDEN_RIGHT;
          editorContainer.style.bottom = HIDDEN_BOTTOM;
          editorContainer.style.width = HIDDEN_WIDTH;
          editorContainer.style.overflow = 'hidden';
          var rawEditor = createEditor(row, column);
          editor = new EditorWrapper(rawEditor);
          var editorElement = editor.element;
          editorContainer.appendChild(editorElement);
          editorElement.classList.add('ko-grid-editor');
          editorElement.style.boxSizing = 'border-box';
          editorElement.style.width = '100%';
          editorElement.style.height = '100%';
          activated = false;
          keyDownSubscription = grid.onKeyDown('.ko-grid-editor', function (e) {
            var keyCode = e.keyCode;
            if (isPassThroughKeyCode(keyCode))
              return;
            else if (e.keyCode === KEY_CODE_ESCAPE) {
              e.preventDefault();
              reset();
              deactivate();
            } else if (!e.ctrlKey && keyCode === KEY_CODE_ENTER || keyCode === KEY_CODE_TAB)
              return save();
            else if (!activated && !e.ctrlKey && !e.altKey)
              activate();
            e.preventApplicationButAllowBrowserDefault();
          });
          function isPassThroughKeyCode(keyCode) {
            var startIndex = activated ? ACTIVATED_START_INDEX : 0, endIndex = activated ? PASS_THROUGH_KEY_RANGES.length : PRE_ACTIVATION_END_INDEX;
            for (var i = startIndex, l = endIndex; i < l; ++i) {
              var RANGE = PASS_THROUGH_KEY_RANGES[i];
              if (RANGE[0] <= keyCode && RANGE[1] >= keyCode) {
                return true;
              }
            }
            return false;
          }
          return {
            init: function (element, row, column) {
              var $__arguments = arguments;
              editingRow = row;
              editingColumn = column;
              binding.init.apply(this, $__arguments);
              element.appendChild(editorContainer);
              if (activated)
                editor.focus();
              else
                editor.activate();
            },
            update: binding.update
          };
        });
        function activate() {
          activated = true;
          editorContainer.style.top = VISIBLE_TOP;
          editorContainer.style.left = VISIBLE_LEFT;
          editorContainer.style.right = VISIBLE_RIGHT;
          editorContainer.style.bottom = VISIBLE_BOTTOM;
          editorContainer.style.width = VISIBLE_WIDTH;
        }
        function deactivate() {
          activated = false;
          editorContainer.style.top = HIDDEN_TOP;
          editorContainer.style.left = HIDDEN_LEFT;
          editorContainer.style.right = HIDDEN_RIGHT;
          editorContainer.style.bottom = HIDDEN_BOTTOM;
          editorContainer.style.width = HIDDEN_WIDTH;
          editor.activate();
        }
        function reset() {
          editor.reset();
        }
        function save() {
          if (editor.valueChanged)
            saveChange(editingRow, editingColumn, editor.value);
        }
      }
    });
    /** @constructor */
    function EditorWrapper(editor) {
      this.__editor = editor;
    }
    EditorWrapper.prototype = {
      get element() {
        return this.__editor['element'];
      },
      get value() {
        return this.__editor['value'];
      },
      set value(newValue) {
        this.__editor['value'] = newValue;
      },
      get valueChanged() {
        return this.__editor['valueChanged'];
      },
      activate: function () {
        this.__editor['activate']();
      },
      focus: function () {
        this.__editor['focus']();
      },
      reset: function () {
        this.__editor['reset']();
      }
    };
    return koGrid.declareExtensionAlias(['editing'], extensionId);
  }({}, knockout, ko_grid);
  ko_grid_editing = function (main) {
    return main;
  }(ko_grid_editing_editing);
  return ko_grid_editing;
}(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid_cell_navigation, ko_data_source, ko_indexed_repeat, ko_grid, knockout);
ko_grid_export = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_export_export, ko_grid_export;
  var toolbar = 'ko-grid-toolbar';
  ko_grid_export_export = function (module, koGrid) {
    var extensionId = 'ko-grid-export'.indexOf('/') < 0 ? 'ko-grid-export' : 'ko-grid-export'.substring(0, 'ko-grid-export'.indexOf('/'));
    var document = window.document, html = document.documentElement;
    var Blob = window.Blob, URL = window.URL;
    koGrid.defineExtension(extensionId, {
      dependencies: [toolbar],
      initializer: function (template) {
        template.into('left-toolbar').insert(' <button class="ko-grid-toolbar-button ko-grid-excel-export">Excel Export</button> ');
      },
      Constructor: function ExportExtension(bindingValue, config, grid) {
        grid.rootElement.addEventListener('click', function (e) {
          if (e.target.classList.contains('ko-grid-excel-export'))
            supplyExcelExport(grid);
        });
      }
    });
    return koGrid.declareExtensionAlias('export', extensionId);
    function supplyExcelExport(grid) {
      var columns = grid.columns.displayed().filter(function (c) {
        return !!c.property;
      });
      var valueSelector = grid.data.valueSelector;
      grid.data.source.streamValues(function (q) {
        return q.filteredBy(grid.data.predicate).sortedBy(grid.data.comparator);
      }).then(function (values) {
        return values.map(function (value) {
          return '<tr>' + columns.map(function (c) {
            return '<td>' + valueSelector(value[c.property]) + '</td>';
          }).join('') + '</tr>';
        }).reduce(function (a, b) {
          return a + b;
        }, '');
      }).then(function (data) {
        var excelDocument = [
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">',
          '  <head></head>' + '  <body>',
          '    <table>',
          '      <thead>',
          '        <tr>' + columns.map(function (c) {
            return '<th>' + c.label() + '</th>';
          }).join('') + '</tr>',
          // TODO groups
          '      </thead>',
          '      <tbody>',
          data,
          '      </tbody>',
          '    </table>',
          '  </body>',
          '</html>'
        ].join('');
        var saveOrOpen = window.navigator.msSaveOrOpenBlob ? window.navigator.msSaveOrOpenBlob.bind(window.navigator) : function (blob, name) {
          var url = URL.createObjectURL(blob);
          var anchor = document.createElement('a');
          anchor.href = url;
          anchor['download'] = name;
          var event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          anchor.dispatchEvent(event);
          // TODO there needs to be a cleaner way to do this
          window.setTimeout(function () {
            return URL.revokeObjectURL(url);
          });
        };
        saveOrOpen(new Blob([excelDocument], { type: 'application/vnd.ms-excel;charset=utf-8' }), 'excel-export.xls');
      });
    }
  }({}, ko_grid);
  ko_grid_export = function (main) {
    return main;
  }(ko_grid_export_export);
  return ko_grid_export;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_filtering = function (onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid) {
  var text, text_ko_grid_filtering_filteringhtmltemplate, ko_grid_filtering_filtering, ko_grid_filtering;
  text = {
    load: function (id) {
      throw new Error('Dynamic load not allowed: ' + id);
    }
  };
  text_ko_grid_filtering_filteringhtmltemplate = '<tr class="ko-grid-tr ko-grid-filter-row" data-bind="css: { applied: extensions.filtering.__applied }">\n    <td class="ko-grid-th ko-grid-filter-cell" data-bind="indexedRepeat: { forEach: columns.displayed, indexedBy: \'id\', as: \'column\' }" data-repeat-bind="if: column().userDefined">\n        <input class="ko-grid-filter" type="text" data-bind="value: extensions.filtering.__forColumn(column()).text, valueUpdate: [\'input\']"/>\n    </td>\n</tr>';
  var viewStateStorage = 'ko-grid-view-state-storage';
  ko_grid_filtering_filtering = function (module, ko, stringifyable, koGrid, filteringTemplate) {
    var extensionId = 'ko-grid-filtering'.indexOf('/') < 0 ? 'ko-grid-filtering' : 'ko-grid-filtering'.substring(0, 'ko-grid-filtering'.indexOf('/'));
    var TRUE = stringifyable.predicates.alwaysTrue;
    koGrid.defineExtension(extensionId, {
      dependencies: [],
      initializer: function (template) {
        return template.after('headers').insert('filters', filteringTemplate);
      },
      Constructor: function FullScreenExtension(bindingValue, config, grid) {
        var filters = {};
        var forColumn = function (column) {
          var columnId = column.id;
          if (!filters[columnId]) {
            var text = ko.observable('');
            if (grid.extensions[viewStateStorage])
              grid.extensions[viewStateStorage].modeIndependent.bind('filters[' + columnId + ']', text);
            filters[columnId] = {
              text: text,
              predicate: ko.pureComputed(function () {
                return parseFilterText(column, text());
              })
            };
          }
          return filters[columnId];
        };
        this['__forColumn'] = forColumn;
        var rowPredicate = ko.pureComputed(function () {
          var columnPredicates = grid.columns.displayed().filter(function (c) {
            return forColumn(c).predicate() !== TRUE;
          }).map(function (c) {
            return forColumn(c).predicate().onResultOf(stringifyable.functions.propertyAccessor(c.property));
          });
          return stringifyable.predicates.and(columnPredicates);
        });
        var throttle = !config.throttle || config.throttle.enabled !== false;
        var throttleAmout = config.throttle && config.throttle.by || 300;
        var throttledRowPredicate = throttle ? rowPredicate.extend({ throttle: throttleAmout }) : rowPredicate;
        var applied = ko.observable(true);
        this['__applied'] = ko.pureComputed(function () {
          applied(applied() || grid.data.rows.displayedSynchronized() && !grid.data.view.dirty());
          return applied();
        });
        grid.data.predicates.push(ko.pureComputed(function () {
          applied(false);
          return throttledRowPredicate();
        }));
        this.dispose = function () {
          throttledRowPredicate.dispose();
        };
      }
    });
    function parseFilterText(column, filterText) {
      if (!filterText.length)
        return TRUE;
      return renderedValuePredicate(column, filterText);
    }
    function renderedValuePredicate(column, filterText) {
      var caseSensitive = filterText.toLowerCase() !== filterText;
      var prependWithAsterisk = function (s) {
        return '*' + s;
      };
      if (filterText.indexOf('*') >= 0)
        return renderedValueRegExpPredicate(column, filterText, caseSensitive);
      else
        return renderedValueRegExpPredicate(column, '*' + filterText.replace(/([A-Z])/g, prependWithAsterisk) + '*', caseSensitive);
    }
    function renderedValueRegExpPredicate(column, filterText, caseSensitive) {
      var patternStringElements = filterText.split('*').map(escapeRegExpPatternString);
      var patternString = '^' + patternStringElements.join('.*') + '$';
      var regExp = new RegExp(patternString, caseSensitive ? '' : 'i');
      var renderValue = column.renderValue;
      var predicate = function (property) {
        return regExp.test(renderValue(property));
      };
      return stringifyable.predicates.from(predicate, function () {
        return stringifyable.predicates.regularExpression(regExp).stringifyable;
      });
    }
    function escapeRegExpPatternString(patternString) {
      return patternString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    return koGrid.declareExtensionAlias('filtering', extensionId);
  }({}, knockout, stringifyable, ko_grid, text_ko_grid_filtering_filteringhtmltemplate);
  ko_grid_filtering = function (main) {
    return main;
  }(ko_grid_filtering_filtering);
  return ko_grid_filtering;
}(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid);
ko_grid_full_screen = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
  var ko_grid_full_screen_full_screen, ko_grid_full_screen;
  var toolbar = 'ko-grid-toolbar';
  var viewModes = 'ko-grid-view-modes';
  ko_grid_full_screen_full_screen = function (module, ko, koGrid) {
    var extensionId = 'ko-grid-full-screen'.indexOf('/') < 0 ? 'ko-grid-full-screen' : 'ko-grid-full-screen'.substring(0, 'ko-grid-full-screen'.indexOf('/'));
    var VIEW_MODE_FULL_SCREEN = 'full-screen';
    var document = window.document, html = document.documentElement;
    koGrid.defineExtension(extensionId, {
      dependencies: [
        toolbar,
        viewModes
      ],
      initializer: function (template) {
        template.into('left-toolbar').insert([
          ' <label class="ko-grid-toolbar-button ko-grid-full-screen-label" data-bind="css: { pressed: extensions.fullScreen.__state }">',
          '  <input type="checkbox" tabIndex="-1" class="ko-grid-full-screen-toggle" data-bind="checked: extensions.fullScreen.__state" />',
          '  Full Screen',
          '</label> '
        ].join(''));
      },
      Constructor: function FullScreenExtension(bindingValue, config, grid) {
        var state = ko.observable(false);
        this['__state'] = state;
        this.enter = function () {
          return state(true);
        };
        this.exit = function () {
          return state(false);
        };
        // TODO maybe needs its own extension based on view-modes?
        var fixedHeight = grid.rootElement.classList.contains('fixed-height');
        var stateSubscription = state.subscribe(function (newState) {
          if (newState) {
            html.classList.add('contains-full-screen-element');
            grid.extensions[viewModes].enter(VIEW_MODE_FULL_SCREEN, function () {
              grid.rootElement.classList.add('fixed-height');
            });
          } else {
            html.classList.remove('contains-full-screen-element');
            grid.extensions[viewModes].leave(VIEW_MODE_FULL_SCREEN, function () {
              if (!fixedHeight)
                grid.rootElement.classList.remove('fixed-height');
            });
          }
        });
        this.dispose = function () {
          return stateSubscription.dispose();
        };
      }
    });
    return koGrid.declareExtensionAliases([
      'fullscreen',
      'fullScreen'
    ], extensionId);
  }({}, knockout, ko_grid);
  ko_grid_full_screen = function (main) {
    return main;
  }(ko_grid_full_screen_full_screen);
  return ko_grid_full_screen;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout);
ko_grid_links = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_links_links, ko_grid_links;
  ko_grid_links_links = function (module, ko, koGrid) {
    var extensionId = 'ko-grid-links'.indexOf('/') < 0 ? 'ko-grid-links' : 'ko-grid-links'.substring(0, 'ko-grid-links'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      Constructor: function LinksExtension(bindingValue, config, grid) {
        Object.keys(bindingValue).forEach(function (columnId) {
          var column = grid.columns.byId(columnId);
          var uriSpec = bindingValue[columnId].uri;
          var labelSpec = bindingValue[columnId].label;
          var uriSelector = typeof uriSpec === 'function' ? uriSpec : function (row) {
            return grid.data.observableValueSelector(ko.unwrap(row[uriSpec]));
          };
          var labelSelector = typeof labelSpec === 'function' ? labelSpec : function (row) {
            return grid.data.observableValueSelector(ko.unwrap(row[labelSpec || column.property]));
          };
          column.overrideValueBinding(function () {
            return {
              init: function (element) {
                var anchor = window.document.createElement('a');
                anchor.appendChild(window.document.createTextNode(''));
                element.appendChild(anchor);
              },
              update: function (element, cell, row) {
                element.firstChild.firstChild.nodeValue = labelSelector(row);
                element.firstChild.href = uriSelector(row);
              }
            };
          });
        });
      }
    });
    return koGrid.declareExtensionAlias('links', extensionId);
  }({}, knockout, ko_grid);
  ko_grid_links = function (main) {
    return main;
  }(ko_grid_links_links);
  return ko_grid_links;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_resize_detection = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_resize_detection_resize_detection, ko_grid_resize_detection;
  ko_grid_resize_detection_resize_detection = function (module, dom, koGrid) {
    var extensionId = 'ko-grid-resize-detection'.indexOf('/') < 0 ? 'ko-grid-resize-detection' : 'ko-grid-resize-detection'.substring(0, 'ko-grid-resize-detection'.indexOf('/'));
    var requestAnimationFrame = window.requestAnimationFrame.bind(window), cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
    koGrid.defineExtension(extensionId, {
      Constructor: function ResizeDetectionExtension(bindingValue, config, grid) {
        var animationFrameRequest;
        var queueLayoutRecalculation = function () {
          if (!animationFrameRequest)
            animationFrameRequest = requestAnimationFrame(function () {
              animationFrameRequest = null;
              grid.layout.recalculate();
            });
        };
        var $ = window['$'];
        var $resizables = $ ? $(dom.element.closest(grid.rootElement, '.ui-resizable')) : {
          'on': function () {
          },
          'off': function () {
          }
        };
        window.addEventListener('resize', queueLayoutRecalculation);
        $resizables['on']('resize resizestop', queueLayoutRecalculation);
        this.dispose = function () {
          window.removeEventListener('resize', queueLayoutRecalculation);
          $resizables['off']('resize resizestop', queueLayoutRecalculation);
        };
      }
    });
    return koGrid.declareExtensionAlias('resizeDetection', extensionId);
  }({}, onefold_dom, ko_grid);
  ko_grid_resize_detection = function (main) {
    return main;
  }(ko_grid_resize_detection_resize_detection);
  return ko_grid_resize_detection;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_selection = function (onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_selection_selection, ko_grid_selection;
  ko_grid_selection_selection = function (module, ko, koGrid) {
    var extensionId = 'ko-grid-selection'.indexOf('/') < 0 ? 'ko-grid-selection' : 'ko-grid-selection'.substring(0, 'ko-grid-selection'.indexOf('/'));
    var SELECTION_CLASS = 'ko-grid-selection-element';
    koGrid.defineExtension(extensionId, {
      Constructor: function SekectionExtension(bindingValue, config, grid) {
        var allowMultiSelection = !!(bindingValue['allowMultiSelection'] || config['allowMultiSelection']);
        var evaluateRowClicks = !!(bindingValue['evaluateRowClicks'] || config['evaluateRowClicks']);
        var selectedEntriesIds = bindingValue['selectedEntriesIds'] || ko.observableArray([]);
        var selectedEntryId = bindingValue['selectedEntryId'] || ko.observable(null);
        var allSelected = false;
        var column = grid.columns.add({
          key: 'selection',
          label: '',
          width: grid.layout.determineCellDimensions(createSelectionElement(allowMultiSelection)).width + 'px'
        });
        var header = grid.headers.forColumn(column);
        var isSelected = {};
        var primaryKey = grid.primaryKey;
        column.overrideValueBinding(function (b) {
          return {
            init: function (element) {
              element.appendChild(createSelectionElement(allowMultiSelection));
            },
            update: function (element, cell, row) {
              selectedEntriesIds();
              // track dependency
              element.firstChild.checked = !!isSelected[grid.data.valueSelector(row[primaryKey])];
            }
          };
        });
        var headerElementSubscription = header.element.subscribe(function (newElement) {
          if (!allowMultiSelection || !newElement)
            return;
          var checkbox = createSelectionElement(true);
          newElement.appendChild(checkbox);
          newElement.addEventListener('click', function (e) {
            if (e.target === newElement) {
              e.preventDefault();
              toggleAllSelection();
            }
          });
        });
        grid.headers.onColumnHeaderClick('.' + SELECTION_CLASS, function (event) {
          event.preventApplicationButAllowBrowserDefault();
          toggleAllSelection();
        });
        function toggleAllSelection() {
          if (allSelected) {
            isSelected = {};
            selectedEntriesIds([]);
          } else {
            grid.data.source.streamValues(function (q) {
              return q.filteredBy(grid.data.predicate);
            }).then(function (s) {
              return s.reduce(function (a, v) {
                var id = grid.data.valueSelector(v[primaryKey]);
                a.ids.push(id);
                a.predicate[id] = true;
                return a;
              }, {
                ids: [],
                predicate: {}
              });
            }).then(function (r) {
              isSelected = r.predicate;
              selectedEntriesIds(r.ids);
            });
          }
        }
        function toggleEntrySelection(event, cell, row) {
          var entryId = grid.data.observableValueSelector(ko.unwrap(row[primaryKey]));
          if (!allowMultiSelection) {
            isSelected = {};
            selectedEntriesIds().length = 0;
          }
          if (isSelected[entryId]) {
            delete isSelected[entryId];
            selectedEntriesIds.remove(entryId);
          } else {
            isSelected[entryId] = true;
            selectedEntriesIds.push(entryId);
          }
        }
        if (evaluateRowClicks)
          grid.data.onCellClick(toggleEntrySelection);
        else
          grid.data.onCellClick('.' + SELECTION_CLASS, toggleEntrySelection);
        grid.data.rows.installClassifier(function (row) {
          selectedEntriesIds();
          // track dependency
          return isSelected[grid.data.observableValueSelector(ko.unwrap(row[primaryKey]))] ? ['selected'] : [];
        });
        var stateComputer = ko.computed(function () {
          var selectedEntryCount = selectedEntriesIds().length;
          var filteredSize = grid.data.view.filteredSize();
          selectedEntryId(selectedEntryCount ? selectedEntriesIds()[selectedEntryCount - 1] : null);
          // TODO This is /broken/! Two sets being of equal size does not imply they are equal.
          allSelected = !!selectedEntryCount && selectedEntryCount === filteredSize;
          var headerElement = header.element(), checkbox = headerElement && headerElement.querySelector('.' + SELECTION_CLASS);
          if (checkbox) {
            checkbox.checked = allSelected;
            checkbox.indeterminate = selectedEntryCount > filteredSize;
          }
        });
        this.dispose = function () {
          headerElementSubscription.dispose();
          stateComputer.dispose();
        };
      }
    });
    function createSelectionElement(allowMultiSelection) {
      var element = window.document.createElement('input');
      element.className = SELECTION_CLASS;
      element.type = allowMultiSelection ? 'checkbox' : 'radio';
      element.tabIndex = -1;
      return element;
    }
    return koGrid.declareExtensionAlias('selection', extensionId);
  }({}, knockout, ko_grid);
  ko_grid_selection = function (main) {
    return main;
  }(ko_grid_selection_selection);
  return ko_grid_selection;
}(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_sorting = function (onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_sorting_sorting, ko_grid_sorting;
  ko_grid_sorting_sorting = function (module, koGrid, stringifyable) {
    var extensionId = 'ko-grid-sorting'.indexOf('/') < 0 ? 'ko-grid-sorting' : 'ko-grid-sorting'.substring(0, 'ko-grid-sorting'.indexOf('/'));
    var DIRECTION_ASCENDING = 'ascending', DIRECTION_DESCENDING = 'descending', CLASS_ASCENDING_ORDER = 'ascending-order', CLASS_DESCENDING_ORDER = 'descending-order';
    koGrid.defineExtension(extensionId, {
      Constructor: function SortingExtension(bindingValue, config, grid) {
        var self = this;
        var sortedByColumn;
        var direction;
        var comparator;
        function valueOf(cell) {
          var value = grid.data.valueSelector(cell);
          return value && typeof value.valueOf === 'function' ? value.valueOf() : value;
        }
        function defaultComparator(column) {
          var propertyName = column.property;
          var accessor = function (row) {
            return valueOf(row[propertyName]);
          };
          stringifyable.makeStringifyable(accessor, function () {
            return stringifyable.functions.propertyAccessor(column.property).stringifyable;
          });
          return stringifyable.comparators.natural.onResultOf(accessor);
        }
        var sortBy = function (column) {
          if (column === sortedByColumn) {
            direction = direction === DIRECTION_ASCENDING ? DIRECTION_DESCENDING : DIRECTION_ASCENDING;
            comparator = comparator.reverse();
          } else {
            if (sortedByColumn)
              sortedByColumn.headerClasses.removeAll([
                CLASS_ASCENDING_ORDER,
                CLASS_DESCENDING_ORDER
              ]);
            sortedByColumn = column;
            direction = DIRECTION_ASCENDING;
            comparator = defaultComparator(column);
          }
          column.headerClasses(sortedByColumn.headerClasses().filter(function (c) {
            return c !== CLASS_ASCENDING_ORDER && c !== CLASS_DESCENDING_ORDER;
          }).concat([direction === DIRECTION_ASCENDING ? CLASS_ASCENDING_ORDER : CLASS_DESCENDING_ORDER]));
          grid.data.comparator(comparator);
        };
        var initialSortingColumnId = bindingValue['initiallyBy'];
        if (initialSortingColumnId)
          sortBy(grid.columns.byId(initialSortingColumnId));
        grid.headers.onColumnHeaderClick(function (e, header) {
          if (e.defaultPrevented)
            return;
          e.preventDefault();
          sortBy(header.column);
        });
        var comparatorSubscription = grid.data.comparator.subscribe(function (newComparator) {
          if (sortedByColumn) {
            if (newComparator !== comparator) {
              sortedByColumn.headerClasses.removeAll([
                CLASS_ASCENDING_ORDER,
                CLASS_DESCENDING_ORDER
              ]);
              sortedByColumn = direction = comparator = null;
            }
            grid.layout.recalculate();
          }
        });
        self.dispose = function () {
          comparatorSubscription.dispose();
        };
      }
    });
    return koGrid.declareExtensionAlias('sorting', extensionId);
  }({}, ko_grid, stringifyable);
  ko_grid_sorting = function (main) {
    return main;
  }(ko_grid_sorting_sorting);
  return ko_grid_sorting;
}(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_toolbar = function (onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_toolbar_toolbar, ko_grid_toolbar;
  ko_grid_toolbar_toolbar = function (module, koGrid) {
    var extensionId = 'ko-grid-toolbar'.indexOf('/') < 0 ? 'ko-grid-toolbar' : 'ko-grid-toolbar'.substring(0, 'ko-grid-toolbar'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      initializer: function (template) {
        template.to('grid').append('toolbar', [
          '<div class="ko-grid-toolbar">',
          '  <div class="ko-grid-left-toolbar"><!--left-toolbar--></div>',
          '  <div class="ko-grid-right-toolbar"><!--right-toolbar--></div>',
          '</div>'
        ].join(''));
      },
      Constructor: function ToolbarExtension() {
      }
    });
    return koGrid.declareExtensionAlias('toolbar', extensionId);
  }({}, ko_grid);
  ko_grid_toolbar = function (main) {
    return main;
  }(ko_grid_toolbar_toolbar);
  return ko_grid_toolbar;
}(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_virtualization = function (onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_virtualization_virtualization, ko_grid_virtualization;
  ko_grid_virtualization_virtualization = function (module, ko, koGrid) {
    var extensionId = 'ko-grid-virtualization'.indexOf('/') < 0 ? 'ko-grid-virtualization' : 'ko-grid-virtualization'.substring(0, 'ko-grid-virtualization'.indexOf('/'));
    koGrid.defineExtension(extensionId, {
      initializer: function (template) {
        template.before('body').insert('<tbody class="ko-grid-virtualization-before-spacer"><tr data-bind="style: { height: extensions.virtualization.__beforeHeight() + \'px\' }"><td></td></tr></tbody>');
        template.after('body').insert('<tbody class="ko-grid-virtualization-after-spacer"><tr data-bind="style: { height: extensions.virtualization.__afterHeight() + \'px\' }"><td></td></tr></tbody>');
      },
      Constructor: function VirtualizationExtension(bindingValue, config, grid) {
        var beforeHeight = ko.observable(0);
        var afterHeight = ko.observable(0);
        this['__beforeHeight'] = beforeHeight;
        this['__afterHeight'] = afterHeight;
        var scroller, beforeSpacer, afterSpacer;
        grid.postApplyBindings(function () {
          scroller = grid.element.querySelector('.ko-grid-table-scroller');
          beforeSpacer = grid.element.querySelector('.ko-grid-virtualization-before-spacer');
          afterSpacer = grid.element.querySelector('.ko-grid-virtualization-after-spacer');
          grid.layout.afterRelayout(recomputeLimit);
          grid.data.view.filteredSize.subscribe(recomputeAfterSpacerSizes);
          scroller.addEventListener('scroll', recomputeOffset);
        });
        // TODO guesstimate a good row height
        var averageRowHeight = 25;
        function recomputeLimit() {
          var limit = Math.ceil((scroller.clientHeight - 1) / averageRowHeight) + 2;
          grid.data.limit(limit);
        }
        function recomputeOffset() {
          var scrollTop = scroller.scrollTop;
          var pixelDelta = scroller.getBoundingClientRect().top - beforeSpacer.getBoundingClientRect().bottom;
          var rowDelta = Math.floor(pixelDelta / averageRowHeight);
          var offset = Math.max(0, Math.min(grid.data.view.filteredSize() - grid.data.view.size() + 2, grid.data.offset() + rowDelta));
          var offsetModulo = offset & 1;
          offset -= offsetModulo;
          grid.data.offset(offset);
          beforeHeight(scrollTop - offsetModulo * averageRowHeight - scrollTop % averageRowHeight);
          recomputeAfterSpacerSizes();
        }
        function recomputeAfterSpacerSizes() {
          afterHeight(Math.max(0, grid.data.view.filteredSize() - grid.data.offset() - grid.data.limit()) * averageRowHeight);
        }
      }
    });
    return koGrid.declareExtensionAlias('virtualization', extensionId);
  }({}, knockout, ko_grid);
  ko_grid_virtualization = function (main) {
    return main;
  }(ko_grid_virtualization_virtualization);
  return ko_grid_virtualization;
}(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);

ko_grid_bundle_bundle = {
  'dataSource': ko_data_source,
  'entry': ko_entry,
  'grid': ko_grid,
  'extensions': {
    'aggregate': ko_grid_aggregate,
    'cellNavigation': ko_grid_cell_navigation,
    'columnResizing': ko_grid_column_resizing,
    'columnScaling': ko_grid_column_scaling,
    'columnSizing': ko_grid_column_sizing,
    'columnWidthPersistence': ko_grid_column_width_persistence,
    'editing': ko_grid_editing,
    'export': ko_grid_export,
    'filtering': ko_grid_filtering,
    'fullScreen': ko_grid_full_screen,
    'links': ko_grid_links,
    'resizeDetection': ko_grid_resize_detection,
    'selection': ko_grid_selection,
    'sorting': ko_grid_sorting,
    'toolbar': ko_grid_toolbar,
    'viewModes': ko_grid_view_modes,
    'viewStateStorage': ko_grid_view_state_storage,
    'virtualization': ko_grid_virtualization
  }
};
ko_grid_bundle = function (main) {
  return main;
}(ko_grid_bundle_bundle);return ko_grid_bundle;
}));