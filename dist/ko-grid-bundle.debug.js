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
var onefold_js, onefold_lists, indexed_list, ko_data_source, onefold_dom, ko_indexed_repeat, ko_grid, ko_grid_aggregate, ko_grid_column_sizing, ko_grid_column_resizing, ko_grid_view_modes, ko_grid_view_state_storage, ko_grid_column_scaling, ko_grid_column_width_persistence, ko_grid_export, ko_grid_filtering, ko_grid_full_screen, ko_grid_links, ko_grid_resize_detection, ko_grid_sorting, ko_grid_toolbar, ko_grid_bundle_bundle, ko_grid_bundle;
onefold_js = function () {
  var onefold_js_objects, onefold_js_arrays, onefold_js_functions, onefold_js_strings, onefold_js_internal, onefold_js;
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
  onefold_js_functions = function () {
    var constant = function (x) {
      return function () {
        return x;
      };
    };
    return {
      // TODO with arrow functions these can go away
      true: constant(true),
      false: constant(false),
      nop: constant(undefined),
      null: constant(null),
      zero: constant(0),
      constant: constant,
      identity: function (x) {
        return x;
      }
    };
  }();
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
  onefold_js_internal = function (arrays, functions, objects, strings) {
    return {
      arrays: arrays,
      functions: functions,
      objects: objects,
      strings: strings
    };
  }(onefold_js_arrays, onefold_js_functions, onefold_js_objects, onefold_js_strings);
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
     * @param {onefold.lists.List<E>} list
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
        throw new Error('Es existiert kein Eintrag mit Id \'' + id + '\'.');
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
        var index = indexOfById(this.__elementIdToIndex, id);
        return this.__elements[index];
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
ko_data_source = function (indexed_list, onefold_lists, onefold_js, knockout) {
  var ko_data_source_client_side_data_source_delta, ko_data_source_client_side_data_source_views_subviews, ko_data_source_client_side_data_source_views_abstract_view, ko_data_source_client_side_data_source_views_root_view, ko_data_source_client_side_data_source_views_filtered_view, ko_data_source_client_side_data_source_views_sorted_view, ko_data_source_client_side_data_source_views_clipped_view, ko_data_source_client_side_data_source_views_views, ko_data_source_streams_mapped_stream, ko_data_source_abstract_data_source, ko_data_source_streams_list_stream, ko_data_source_queries_query, ko_data_source_queries_limitable_query_configurator, ko_data_source_queries_offsettable_query_configurator, ko_data_source_queries_sortable_query_configurator, ko_data_source_queries_filterable_query_configurator, ko_data_source_queries_query_configurator, ko_data_source_client_side_data_source_client_side_data_source, ko_data_source_default_observable_state_transitioner, ko_data_source_observable_entries, ko_data_source_ko_data_source, ko_data_source;
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
      this._observables = null;
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
        if (!this._observables)
          this._observables = ko.observable(this._indexedValues.map(this._observableEntries.addReference));
        return this._observables;
      },
      _synchronizeObservables: function (delta) {
        this._values.valueHasMutated();
        if (this._observables) {
          delta.added.forEach(this._observableEntries.addReference);
          this._observables(this._indexedValues.map(this._observableEntries.lookup));
          delta.removed.forEach(this._observableEntries.releaseReference);
        }
      },
      _releaseObservableReferences: function () {
        if (this._observables)
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
    // TODO this actually duplicates some tiny parts of AbstractView... consolidate somehow? (the prototypes are interesting too, perhaps more so)
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
    ClippedView.prototype = js.functions.identity({
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
    });
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
     * @extends Stream<I>
     *
     * @param {!Stream<D>} sourceStream
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
     * @extends {DataSource<I, V, O>}
     *
     * @param {!ObservableEntries<I, V, O>} observableEntries
     * @param {!function(I):V} getValueById
     */
    function AbstractDataSource(observableEntries, getValueById) {
      this.__getValueById = getValueById;
      this.__observableEntries = observableEntries;
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
    var proto = AbstractDataSource.prototype;
    js.objects.extend(proto, {
      'openEntryView': proto.openEntryView,
      'openOptionalEntryView': proto.openOptionalEntryView,
      'streamObservables': proto.streamObservables
    });
    /**
     * @constructor
     * @template V, O
     * @extends {EntryView<V, O>}
     *
     * @param {OptionalEntryView<V, O>} optionalEntryView
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
    /**
     * @constructor
     * @template I, V, O
     * @extends {OptionalEntryView<V, O>}
     *
     * @param {ObservableEntries<I, V, O>} observableEntries
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
        var sharedObservable = this.__observableEntries.addOptionalReference(this.value());
        this.__observable = sharedObservable();
        this.__optionalObservable = ko.observable({
          present: true,
          observable: this.observable()
        });
        this.__subscription = sharedObservable.subscribe(function () {
          this.__optionalObservable({
            present: false,
            observable: this.observable()
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
    return AbstractDataSource;
  }(knockout, onefold_js, ko_data_source_streams_mapped_stream);
  ko_data_source_streams_list_stream = function (js, MappedStream) {
    /**
     * @constructor
     * @template T
     * @extends Stream<T>
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
  ko_data_source_queries_query = function () {
    function Query(predicate, comparator, offset, limit) {
      this._predicate = predicate;
      this._comparator = comparator;
      this._offset = offset;
      this._limit = limit;
    }
    return Query;
  }();
  ko_data_source_queries_limitable_query_configurator = function (js, Query) {
    function LimitableQueryConfigurator(predicate, comparator, offset) {
      Query.call(this, predicate, comparator, offset);
    }
    var proto = {
      limitedTo: function (limit) {
        return new Query(this._predicate, this._comparator, this._offset, limit);
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
        return new LimitableQueryConfigurator(this._predicate, this._comparator, offset);
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
        return new OffsettableQueryConfigurator(this._predicate, comparator);
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
      AbstractDataSource = ko_data_source_abstract_data_source, Delta = ko_data_source_client_side_data_source_delta, IndexedList = indexed_list, ListStream = ko_data_source_streams_list_stream, QueryConfigurator = ko_data_source_queries_query_configurator;
    /**
     * @constructor
     * @template I, V, O
     * @extends {DataSource<I, V, O>}
     */
    function ClientSideDataSource(idSelector, observableEntries) {
      var values = new IndexedList(idSelector);
      AbstractDataSource.call(this, observableEntries, function (entryId) {
        return values.getById(entryId);
      });
      this.__idSelector = idSelector;
      this.__observableEntries = observableEntries;
      this.__values = values;
      this.__deltas = ko.observable(new Delta());
      this.__openViewReferences = [];
      this.__addOpenViewReference(new OpenViewKey(), new views.RootView(this.__idSelector, this.__observableEntries, this.__values, this.__deltas));
    }
    ClientSideDataSource.prototype = {
      __addOpenViewReference: function (key, view) {
        var ref = new OpenViewReference(key, view, function () {
          return this.__openViewReferences.splice(this.__openViewReferences.indexOf(ref), 1);
        }.bind(this));
        this.__openViewReferences.push(ref);
        return ref;
      },
      __increaseReferenceCountOrOpenNewView: function (key) {
        var existing = js.arrays.singleOrNull(this.__openViewReferences, function (v) {
          return key.equals(v.key);
        });
        if (existing) {
          ++existing.referenceCount;
          return existing;
        } else {
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
      },
      addOrUpdateEntries: function (entries) {
        var added = [], updated = [];
        entries.forEach(function (entry) {
          return (this.__values.contains(entry) ? updated : added).push();
        }.bind(this));
        new Delta(added, updated).propagateTo(this.__deltas);
      },
      openView: function (queryConfiguration) {
        var query = (queryConfiguration || function (x) {
          return x;
        })(new QueryConfigurator());
        var key = OpenViewKey.fromQuery(query);
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
      },
      replaceEntries: function (newEntries) {
        var removedEntries = this.__values.toArray();
        this.__values.clear();
        this.__values.addAll(newEntries);
        new Delta(newEntries, [], removedEntries).propagateTo(this.__deltas);
        // TODO update only those that were already there before the delta was propagated
        this.__observableEntries.updateEntries(newEntries);
      },
      streamValues: function (queryConfiguration) {
        var view = this.openView(queryConfiguration);
        try {
          /** @type {?} */
          var untypedValues = view.values;
          /** @type {function():onefold.lists.List<?>} */
          var values = untypedValues;
          return Promise.resolve(new ListStream(values().slice()));
        } finally {
          view.dispose();
        }
      },
      updateEntries: function (updatedEntries) {
        this.__values.updateAll(updatedEntries);
        new Delta([], updatedEntries).propagateTo(this.__deltas);
        this.__observableEntries.updateEntries(updatedEntries);
      }  // TODO implement dispose
    };
    ClientSideDataSource.prototype = js.objects.extend({}, AbstractDataSource.prototype, ClientSideDataSource.prototype, {
      'addEntries': ClientSideDataSource.prototype.addEntries,
      'dispose': ClientSideDataSource.prototype.dispose,
      'addOrUpdateEntries': ClientSideDataSource.prototype.addOrUpdateEntries,
      'openView': ClientSideDataSource.prototype.openView,
      'removeEntries': ClientSideDataSource.prototype.removeEntries,
      'replaceEntries': ClientSideDataSource.prototype.replaceEntries,
      'streamValues': ClientSideDataSource.prototype.streamValues,
      'updateEntries': ClientSideDataSource.prototype.updateEntries
    });
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
      this.rank = Math.max(this.predicate === TRUE ? 0 : 1, this.comparator === ZERO ? 0 : 2, this.offset === 0 && this.limit === Number.POSITIVE_INFINITY ? 0 : 3);
    }
    OpenViewKey.fromQuery = function (query) {
      return new OpenViewKey(query._predicate, query._comparator, query._offset, query._limit);
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
      },
      releaseReference: function () {
        if (--this.referenceCount === 0) {
          this.disposer();
        }
      }
    };
    /**
     * @constructor
     * @template V, O
     * @extends {View<V, O>}
     *
     * @param internalView
     * @param internalViewRefs
     */
    function InternalViewAdapter(internalView, internalViewRefs) {
      this.__internalView = internalView;
      this.__internalViewRefs = internalViewRefs;
    }
    InternalViewAdapter.prototype = {
      get values() {
        return this.__internalView.values;
      },
      get observables() {
        return this.__internalView.observables;
      },
      dispose: function () {
        this.__internalViewRefs.forEach(function (r) {
          r.releaseReference();
        });
      }
    };
    InternalViewAdapter.prototype = js.objects.extend({
      get 'values'() {
        return this.values;
      },
      get 'observables'() {
        return this.observables;
      },
      'dispose': InternalViewAdapter.prototype.dispose
    }, InternalViewAdapter.prototype);
    return ClientSideDataSource;
  }({});
  ko_data_source_default_observable_state_transitioner = function (ko) {
    return function DefaultObservableStateTransitioner() {
      var isNonObservableProperty = {};
      Array.prototype.slice.call(arguments).forEach(function (property) {
        isNonObservableProperty[property] = true;
      });
      this.constructor = function (entry) {
        var observable = {};
        Object.keys(entry).forEach(function (p) {
          if (isNonObservableProperty[p])
            observable[p] = entry[p];
          else
            observable[p] = ko.observable(entry[p]);
        });
        return observable;
      };
      this.updater = function (observable, updatedEntry) {
        Object.keys(updatedEntry).filter(function (p) {
          return !isNonObservableProperty[p];
        }).forEach(function (p) {
          observable[p](updatedEntry[p]);
        });
        return observable;
      };
      this.destructor = function () {
      };
    };
  }(knockout);
  ko_data_source_observable_entries = function (ko) {
    /** @constructor */
    function ObservableEntry(observable) {
      this.observable = observable;
      this.optionalObservable = ko.observable(observable);
      this.refcount = 1;
    }
    // TODO reduce interface to minimum (addReference, addOptionalReference, releaseReference, updateEntries, dispose, ...?)
    return function ObservableEntries(idSelector, observableStateTransitioner) {
      observableStateTransitioner = observableStateTransitioner || {
        constructor: function (entry) {
          var observable = {};
          Object.keys(entry).forEach(function (k) {
            observable[k] = ko.observable(entry[k]);
          });
          return observable;
        },
        updater: function (observable, updatedEntry) {
          Object.keys(updatedEntry).forEach(function (k) {
            observable[k](updatedEntry[k]);
          });
          return observable;
        },
        destructor: function () {
        }
      };
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
        var entry = new ObservableEntry(observableStateTransitioner.constructor(value));
        hashtable[id] = entry;
        return entry;
      };
      this.releaseReference = function (value) {
        var id = idSelector(value);
        var entry = lookupEntry(id);
        if (--entry.refcount === 0) {
          observableStateTransitioner.destructor(entry.observable);
          delete hashtable[id];
        }
      };
      this.forcefullyReleaseRemainingReferencesById = function (id) {
        var entry = lookupEntry(id);
        entry.optionalObservable(null);
        observableStateTransitioner.destructor(entry.observable);
        delete hashtable[id];
      };
      this.lookup = function (value) {
        return lookupEntry(idSelector(value)).observable;
      };
      this.withById = function (id, action) {
        return action(lookupEntry(id).observable);
      };
      this.with = function (value, action) {
        return this.withById(idSelector(value), action);
      }.bind(this);
      this.withPresentById = function (id, action) {
        var entry = tryLookupEntry(id);
        if (entry)
          action(entry.observable);
      };
      this.withPresent = function (value, action) {
        return this.withPresentById(idSelector(value), action);
      }.bind(this);
      this.updateEntries = function (updatedEntries) {
        updatedEntries.forEach(function (updatedEntry) {
          this.withPresent(updatedEntry, function (observable) {
            observableStateTransitioner.updater(observable, updatedEntry);
          });
        }.bind(this));
      }.bind(this);
      this.dispose = function () {
        Object.keys(hashtable).forEach(this.forcefullyReleaseRemainingReferencesById);
      }.bind(this);
      var tryLookupEntry = function (id) {
        if (typeof id !== 'string')
          throw newInvalidIdTypeError(id);
        if (!Object.prototype.hasOwnProperty.call(hashtable, id))
          return null;
        return hashtable[id];
      };
      var lookupEntry = function (id) {
        var entry = tryLookupEntry(id);
        if (!entry)
          throw new Error('Es existierte keine Referenz zum Objekt mit Id \'' + id + '\' oder es wurden bereits alle freigegeben.');
        return entry;
      };
    };
  }(knockout);
  ko_data_source_ko_data_source = function (ClientSideDataSource, DefaultObservableStateTransitioner, ObservableEntries) {
    return {
      // TODO ServerSideDataSource: extend (and partially reduce?) DataSource interface to make room
      'ClientSideDataSource': ClientSideDataSource,
      'DefaultObservableStateTransitioner': DefaultObservableStateTransitioner,
      'ObservableEntries': ObservableEntries
    };
  }(ko_data_source_client_side_data_source_client_side_data_source, ko_data_source_default_observable_state_transitioner, ko_data_source_observable_entries);
  ko_data_source = function (main) {
    return main;
  }(ko_data_source_ko_data_source);
  return ko_data_source;
}(indexed_list, onefold_lists, onefold_js, knockout);
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
        carcass.style.display = '';
        insertNodeAfter(carcass, addedItem.previousId);
        var revivedBindingContext = ko.contextFor(carcass);
        revivedBindingContext[itemVariableName](addedItem.item);
        revivedBindingContext[indexVariableName](addedItem.index);
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
ko_grid = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_template, text, text_ko_grid_columnshtmltemplate, ko_grid_columns, ko_grid_application_event_dispatcher, text_ko_grid_datahtmltemplate, ko_grid_data, text_ko_grid_headershtmltemplate, ko_grid_headers, ko_grid_layout, ko_grid_core, ko_grid_extensions, text_ko_grid_gridhtmltemplate, ko_grid_binding, ko_grid;
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
          return placeholders[id] === PLACEHOLDER_KIND_REGULAR ? '<!--' + id + '-->' : operator === OPERATOR_TO_APPEND ? afterPlaceholder : beforePlaceholder;
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
      'init': js.functions.nop,
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
      this.metadata = gridConfig['columnMetadataProvider'] ? gridConfig['columnMetadataProvider'](grid, column) : {};
      this['metadata'] = this.metadata;
      this.renderValue = gridConfig['cellValueRenderer'] ? gridConfig['cellValueRenderer'].bind(undefined, this) : TO_STRING_VALUE_RENDERER;
      this['renderValue'] = this.renderValue;
      this.overrideValueRendering = function (override) {
        this.renderValue = override(this.renderValue);
      }.bind(this);
      this.overrideValueBinding = function (override) {
        var overridden = override({
          init: this._initCell,
          update: this._updateCell
        });
        if (!overridden || !overridden.init || !overridden.update)
          throw new Error('The cell value binding must define an `init` as well as an `update` method.');
        this._initCell = overridden.init;
        this._updateCell = overridden.update;
      }.bind(this);
      this['overrideValueRendering'] = this.overrideValueRendering;
      this['overrideValueBinding'] = this.overrideValueBinding;
    }
    return columns;
  }(knockout, onefold_js, text_ko_grid_columnshtmltemplate);
  ko_grid_application_event_dispatcher = function (js, dom) {
    /** @constructor */
    function ApplicationEvent(originalEvent) {
      var applicationDefaultPrevented = originalEvent.defaultPrevented;
      js.objects.extend(this, originalEvent, {
        preventDefault: function () {
          applicationDefaultPrevented = true;
          return originalEvent.preventDefault();
        },
        preventApplicationButAllowBrowserDefault: function () {
          applicationDefaultPrevented = true;
        },
        get defaultPrevented() {
          return applicationDefaultPrevented;
        }
      });
    }
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
  text_ko_grid_datahtmltemplate = '<tbody class="ko-grid-tbody" data-bind="_gridWidth: columns.combinedWidth() + \'px\'">\n    <tr class="ko-grid-tr ko-grid-row"\n        data-bind="indexedRepeat: {\n            forEach: data.rows.displayed,\n            indexedBy: function(r) { return grid.data.observableValueSelector(ko.unwrap(r[grid.primaryKey])); },\n            as: \'row\',\n            at: \'rowIndex\',\n            allowDeviation: true,\n            onDeviation: data.rows.__handleDisplayedRowsDeviate,\n            onSynchronization: data.rows.__handleDisplayedRowsSynchronized }"\n        data-repeat-bind="__gridRow: { classify: grid.data.rows.__classify, row: row, index: rowIndex }">\n\n        <td data-bind="indexedRepeat: { forEach: columns.displayed, indexedBy: \'id\', as: \'column\', allowElementRecycling: false }"\n            data-repeat-bind="__gridCell: { row: row, column: column }"></td>\n    </tr>\n</tbody>';
  ko_grid_data = function (ko, js, ApplicationEventDispatcher, dataTemplate) {
    var ELEMENT_NODE = window.Node.ELEMENT_NODE;
    var INDIFFERENT_COMPARATOR = js.functions.zero;
    var document = window.document;
    var data = {
      init: function (template) {
        template.into('body').insert(dataTemplate);
      },
      Constructor: function (bindingValue, config, grid) {
        var disposeCallbacks = [];
        /** @type {DataSource<?>} */
        this.source = bindingValue['dataSource'];
        this.valueSelector = bindingValue['valueSelector'] || config['valueSelector'] || js.functions.identity;
        this['valueSelector'] = this.valueSelector;
        this.observableValueSelector = bindingValue['observableValueSelector'] || config['observableValueSelector'] || this.valueSelector;
        this['observableValueSelector'] = this.observableValueSelector;
        this.predicates = ko.observableArray(bindingValue.filters || []);
        this['predicates'] = this.predicates;
        this.predicate = ko.pureComputed(function () {
          var predicates = this.predicates().map(ko.unwrap);
          return function (row) {
            for (var i = 0; i < predicates.length; i++)
              if (!predicates[i](row))
                return false;
            return true;
          };
        }.bind(this));
        this['predicate'] = this.predicate;
        this.comparator = ko.observable(INDIFFERENT_COMPARATOR);
        this['comparator'] = this.comparator;
        this.offset = ko.observable(0);
        this['offset'] = this.offset;
        this.limit = ko.observable(Number.POSITIVE_INFINITY);
        this['limit'] = this.limit;
        this._preApplyBindings = js.functions.nop;
        this.__preApplyBindings = function (callback) {
          var innerCallback = this._preApplyBindings;
          this._preApplyBindings = function () {
            callback(innerCallback);
          };
        }.bind(this);
        this._postApplyBindings = js.functions.nop;
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
      this.__preApplyBindings(function (inner) {
        inner();
        var view = this.source.openView(function (q) {
          return q.filteredBy(this.predicate).sortedBy(this.comparator).offsetBy(this.offset).limitedTo(this.limit);
        }.bind(this));
        disposables.push(view);
        disposables.push(view.observables.subscribe(function (v) {
          this.rows.displayed(v);
        }.bind(this)));
        rows.displayed(view.observables());
      }.bind(this));
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
      return js.functions.nop;
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
      this.lookupCell = function (row, column) {
        var rowIndex = this.rows.displayed().indexOf(row);
        var columnIndex = grid.columns.displayed().indexOf(column);
        var element = nthCellOfRow(nthRowElement(rowIndex), columnIndex);
        function hijack(classes) {
          if (element.hasAttribute('data-hijacked'))
            throw new Error('Illegal state: This cell is already hijacked.');
          while (element.firstChild)
            ko.removeNode(element.firstChild);
          element.className += ' ' + classes;
          element.setAttribute('data-hijacked', 'hijacked ' + classes);
          function release() {
            element.removeAttribute('data-hijacked');
            while (element.firstChild)
              ko.removeNode(element.firstChild);
            var rowObservable = ko.contextFor(element)['row']();
            if (column._initCell)
              column._initCell(element, rowObservable, column);
            else
              element.appendChild(document.createTextNode(''));
            updateCellElement(element, rowObservable(), column);
          }
          return {
            'dispose': release,
            'release': release
          };
        }
        return {
          'element': element,
          'hijack': hijack
        };
      }.bind(this);
      this['lookupCell'] = this.lookupCell;
      return js.functions.nop;
    }
    ko.bindingHandlers['__gridRow'] = {
      'init': js.functions.nop,
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
        var row = value['row'];
        var column = value['column'];
        var columnValue = column();
        while (element.firstChild)
          ko.removeNode(element.firstChild);
        if (columnValue._initCell)
          columnValue._initCell(element, row, column);
        else
          element.appendChild(document.createTextNode(''));
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
    function updateCellElement(element, row, column) {
      var cell = row[column.property];
      var cellValue = cell && ko.unwrap(cell);
      var hijacked = element.getAttribute('data-hijacked');
      // TODO since there may be thousands of cells we want to keep the dependency count at two (row+cell) => peek => need separate change handler for cellClasses
      var columnClasses = column.cellClasses.peek().join(' ');
      element.className = 'ko-grid-td ko-grid-cell ' + columnClasses + (hijacked ? ' ' + hijacked : '');
      if (hijacked)
        return;
      if (column._initCell)
        column._updateCell(element, cell, row, column);
      else {
        element.lastChild.nodeValue = column.renderValue(cellValue);
      }
    }
    return data;
  }(knockout, onefold_js, ko_grid_application_event_dispatcher, text_ko_grid_datahtmltemplate);
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
  ko_grid_layout = function (ko, js) {
    var document = window.document;
    var layout = {
      init: js.functions.nop,
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
  }(knockout, onefold_js);
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
      this.initializer = spec.initializer || js.functions.nop;
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
  ko_grid_binding = function (req, ko, js) {
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
      this.primaryKey = bindingValue['primaryKey'];
      this['primaryKey'] = this.primaryKey;
      this.rootElement = rootElement;
      this['rootElement'] = rootElement;
      this.element = null;
      this['element'] = null;
      this._classes = ko.observableArray([]);
      this._dispose = js.functions.nop;
      this.__postApplyBindings = js.functions.nop;
      this.postApplyBindings = function (callback) {
        if (!this.__postApplyBindings)
          throw new Error('Illegal state: postApplyBindings-callbacks have been called already.');
        var innerCallback = this.__postApplyBindings;
        this.__postApplyBindings = function () {
          innerCallback();
          callback();
        };
      }.bind(this);
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
          var extensionConfig = extension.extractConfiguration(extensionConfigs, configName);
          var extensionBindingValue = extension.tryExtractBindingValue(extensionBindingValues) || {};
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
        coreComponentNames.forEach(function (n) {
          if (grid[n]._preApplyBindings)
            grid[n]._preApplyBindings();
        });
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
      return { 'controlsDescendantBindings': true };
    };
    ko.bindingHandlers['grid']['update'] = js.functions.nop;
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
      'init': js.functions.nop,
      'update': function (element, valueAccessor) {
        var w = valueAccessor();
        element.style.width = w;
        element.style.maxWidth = w;
      }
    };
    return koGrid;
  }(req, knockout, onefold_js);
  ko_grid = function (main) {
    return main;
  }(ko_grid_binding);
  return ko_grid;
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_aggregate = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
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
        // TODO support date and perhaps other types
        var idCounter = 0;
        var updateAggregates = function () {
          grid.data.source.streamValues(function (q) {
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
          }).then(function (statistics) {
            var count = statistics.count;
            aggregateRows(bindingValue.map(function (aggregates) {
              var row = { id: '' + ++idCounter };
              grid.columns.displayed().forEach(function (column) {
                var columnId = column.id;
                var property = column.property;
                var aggregate = aggregates[columnId];
                if (aggregate) {
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
        };
        var predicateSubscription = grid.data.predicate.subscribe(updateAggregates);
        updateAggregates();
        this.dispose = function () {
          predicateSubscription.dispose();
        };
      }
    });
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_column_sizing = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_column_resizing = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_data_source, ko_indexed_repeat, ko_grid, knockout);
ko_grid_view_modes = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_view_state_storage = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
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
     * @extends koGrid.extensions.viewStateStorage.BindableKeyValueStore
     *
     * @param {koGrid.extensions.viewStateStorage.KeyValueStore} keyValueStorage
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
     * @extends koGrid.extensions.viewStateStorage.KeyValueStore
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout);
ko_grid_column_scaling = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_resizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_column_sizing, ko_grid_view_modes, knockout, ko_grid) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_resizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_column_sizing, ko_grid_view_modes, knockout, ko_grid);
ko_grid_column_width_persistence = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_column_sizing, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid);
ko_grid_export = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
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
          anchor.download = name;
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_filtering = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid) {
  var text, text_ko_grid_filtering_filteringhtmltemplate, ko_grid_filtering_filtering, ko_grid_filtering;
  text = {
    load: function (id) {
      throw new Error('Dynamic load not allowed: ' + id);
    }
  };
  text_ko_grid_filtering_filteringhtmltemplate = '<tr class="ko-grid-tr ko-grid-filter-row" data-bind="css: { applied: extensions.filtering.__applied }">\n    <td class="ko-grid-th ko-grid-filter-cell" data-bind="indexedRepeat: { forEach: columns.displayed, indexedBy: \'id\', as: \'column\'  }">\n        <input class="ko-grid-filter" type="text" data-bind="value: extensions.filtering.__forColumn(column()).text, valueUpdate: [\'keypress\', \'keyup\']"/>\n    </td>\n</tr>';
  var viewStateStorage = 'ko-grid-view-state-storage';
  ko_grid_filtering_filtering = function (module, ko, koGrid, filteringTemplate) {
    var extensionId = 'ko-grid-filtering'.indexOf('/') < 0 ? 'ko-grid-filtering' : 'ko-grid-filtering'.substring(0, 'ko-grid-filtering'.indexOf('/'));
    var TRUE = function () {
      return true;
    };
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
                return parseFilterText(grid, column, text());
              })
            };
          }
          return filters[columnId];
        };
        this['__forColumn'] = forColumn;
        var rowPredicate = ko.pureComputed(function () {
          var columnPredicates = [];
          grid.columns.displayed().forEach(function (column) {
            var columnPredicate = forColumn(column).predicate();
            if (columnPredicate !== TRUE)
              columnPredicates.push(function (row) {
                return columnPredicate(row[column.property]);
              });
          });
          return !columnPredicates.length ? TRUE : function (row) {
            for (var i = 0; i < columnPredicates.length; ++i)
              if (!columnPredicates[i](row))
                return false;
            return true;
          };
        });
        var throttle = !config.throttle || config.throttle.enabled !== false;
        var throttleAmout = config.throttle && config.throttle.by || 150;
        var throttledRowPredicate = throttle ? rowPredicate.extend({ throttle: throttleAmout }) : rowPredicate;
        var applied = ko.observable(true);
        this['__applied'] = applied;
        grid.data.predicates.push(ko.pureComputed(function () {
          applied(false);
          return throttledRowPredicate();
        }));
        var appliedSubscription = grid.data.rows.displayedSynchronized.subscribe(function (synchronized) {
          applied(applied() || synchronized);
        });
        this.dispose = function () {
          appliedSubscription.dispose();
          throttledRowPredicate.dispose();
        };
      }
    });
    function parseFilterText(grid, column, filterText) {
      if (!filterText.length)
        return TRUE;
      return renderedValuePredicate(grid, column, filterText);
    }
    function renderedValuePredicate(grid, column, filterText) {
      var caseSensitive = filterText.toLowerCase() !== filterText;
      var prependWithAsterisk = function (s) {
        return '*' + s;
      };
      if (filterText.indexOf('*') >= 0)
        return renderedValueRegExpPredicate(grid, column, filterText, caseSensitive);
      else
        return renderedValueRegExpPredicate(grid, column, '*' + filterText.replace(/([A-Z])/g, prependWithAsterisk) + '*', caseSensitive);
    }
    function renderedValueRegExpPredicate(grid, column, filterText, caseSensitive) {
      var patternStringElements = filterText.split('*').map(escapeRegExpPatternString);
      var patternString = '^' + patternStringElements.join('.*') + '$';
      var regExp = new RegExp(patternString, caseSensitive ? '' : 'i');
      var renderValue = column.renderValue;
      var valueSelector = grid.data.valueSelector;
      return function (property) {
        return regExp.test(renderValue(valueSelector(property)));
      };
    }
    function escapeRegExpPatternString(patternString) {
      return patternString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    return koGrid.declareExtensionAlias('filtering', extensionId);
  }({}, knockout, ko_grid, text_ko_grid_filtering_filteringhtmltemplate);
  ko_grid_filtering = function (main) {
    return main;
  }(ko_grid_filtering_filtering);
  return ko_grid_filtering;
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_view_state_storage, ko_data_source, ko_indexed_repeat, ko_grid_view_modes, knockout, ko_grid);
ko_grid_full_screen = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout);
ko_grid_links = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_resize_detection = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_sorting = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
  var ko_grid_sorting_sorting, ko_grid_sorting;
  ko_grid_sorting_sorting = function (module, koGrid) {
    var extensionId = 'ko-grid-sorting'.indexOf('/') < 0 ? 'ko-grid-sorting' : 'ko-grid-sorting'.substring(0, 'ko-grid-sorting'.indexOf('/'));
    var DIRECTION_ASCENDING = 'ascending', DIRECTION_DESCENDING = 'descending', CLASS_ASCENDING_ORDER = 'ascending-order', CLASS_DESCENDING_ORDER = 'descending-order';
    koGrid.defineExtension(extensionId, {
      Constructor: function SortingExtension(bindingValue, config, grid) {
        var self = this;
        var sortedByColumn;
        var direction;
        var ordering;
        function valueOf(cell) {
          var value = grid.data.valueSelector(cell);
          return value && typeof value.valueOf === 'function' ? value.valueOf() : value;
        }
        // TODO user should be able to to define the comparator (via column metadata)
        function compareValues(valueA, valueB) {
          return typeof valueA === 'string' && typeof valueB === 'string' ? valueA.localeCompare(valueB) : valueA <= valueB ? valueA < valueB ? -1 : 0 : 1;
        }
        function defaultComparator(column) {
          return function (rowA, rowB) {
            var valueA = valueOf(rowA[column.property]);
            var valueB = valueOf(rowB[column.property]);
            // TODO use Intl.Collator once safari implements internationalization.. see http://caniuse.com/#feat=internationalization
            return valueA === null && valueB === null ? 0 : valueA === null ? -1 : valueB === null ? 1 : compareValues(valueA, valueB);
          };
        }
        var sortBy = function (column) {
          if (column === sortedByColumn) {
            direction = direction === DIRECTION_ASCENDING ? DIRECTION_DESCENDING : DIRECTION_ASCENDING;
            ordering = ordering.reverse();
          } else {
            if (sortedByColumn)
              sortedByColumn.headerClasses.removeAll([
                CLASS_ASCENDING_ORDER,
                CLASS_DESCENDING_ORDER
              ]);
            sortedByColumn = column;
            direction = DIRECTION_ASCENDING;
            ordering = new Ordering(defaultComparator(column));
          }
          column.headerClasses(sortedByColumn.headerClasses().filter(function (c) {
            return c !== CLASS_ASCENDING_ORDER && c !== CLASS_DESCENDING_ORDER;
          }).concat([direction === DIRECTION_ASCENDING ? CLASS_ASCENDING_ORDER : CLASS_DESCENDING_ORDER]));
          grid.data.comparator(ordering.comparator);
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
            if (newComparator !== ordering.comparator) {
              sortedByColumn.headerClasses.removeAll([
                CLASS_ASCENDING_ORDER,
                CLASS_DESCENDING_ORDER
              ]);
              sortedByColumn = direction = ordering = null;
            }
            grid.layout.recalculate();
          }
        });
        self.dispose = function () {
          comparatorSubscription.dispose();
        };
      }
    });
    /**
     * @constructor
     * @template T
     *
     * @param {function(T, T):number} comparator
     * @param {Ordering=} reverse
     */
    function Ordering(comparator, reverse) {
      var self = this;
      self.comparator = comparator;
      self.__reverse = reverse || new Ordering(function (a, b) {
        return comparator(b, a);
      }, this);
    }
    Ordering.prototype = {
      reverse: function () {
        return this.__reverse;
      }
    };
    return koGrid.declareExtensionAlias('sorting', extensionId);
  }({}, ko_grid);
  ko_grid_sorting = function (main) {
    return main;
  }(ko_grid_sorting_sorting);
  return ko_grid_sorting;
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);
ko_grid_toolbar = function (onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout) {
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
}(onefold_dom, indexed_list, onefold_lists, onefold_js, ko_grid, ko_data_source, ko_indexed_repeat, knockout);

ko_grid_bundle_bundle = {
  'dataSource': ko_data_source,
  'grid': ko_grid,
  'extensions': {
    'aggregate': ko_grid_aggregate,
    'columnResizing': ko_grid_column_resizing,
    'columnScaling': ko_grid_column_scaling,
    'columnSizing': ko_grid_column_sizing,
    'columnWidthPersistence': ko_grid_column_width_persistence,
    'export': ko_grid_export,
    'filtering': ko_grid_filtering,
    'fullScreen': ko_grid_full_screen,
    'links': ko_grid_links,
    'resizeDetection': ko_grid_resize_detection,
    'sorting': ko_grid_sorting,
    'toolbar': ko_grid_toolbar,
    'viewModes': ko_grid_view_modes,
    'viewStateStorage': ko_grid_view_state_storage
  }
};
ko_grid_bundle = function (main) {
  return main;
}(ko_grid_bundle_bundle);return ko_grid_bundle;
}));