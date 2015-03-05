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
/**
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
var onefold_js, onefold_lists, indexed_list, ko_data_source, onefold_dom, ko_indexed_repeat, ko_grid, ko_grid_aggregate, ko_grid_links, ko_grid_sorting, ko_grid_bundle_bundle, ko_grid_bundle;
onefold_js = function () {
  var onefold_js_arrays, onefold_js_functions, onefold_js_objects, onefold_js_strings, onefold_js_internal, onefold_js;
  onefold_js_arrays = function () {
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
    return {
      contains: function (array, value) {
        return array.indexOf(value) >= 0;
      },
      flatMap: function (array, mapping) {
        return Array.prototype.concat.apply([], array.map(mapping));
      },
      stableSort: function (array, comparator) {
        return stableSort(array, comparator || naturalComparator, true);
      }
    };
  }();
  onefold_js_functions = function () {
    var constant = function (x) {
      return function () {
        return x;
      };
    };
    return {
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
  onefold_js_objects = function () {
    function hasOwn(owner, propertyName) {
      return Object.prototype.hasOwnProperty.call(owner, propertyName);
    }
    function forEachProperty(owner, action) {
      for (var propertyName in owner)
        if (hasOwn(owner, propertyName))
          action(propertyName, owner[propertyName]);
    }
    return {
      areEqual: function (a, b) {
        return a === b || !!(a && typeof a.valueOf === 'function' && b && typeof b.valueOf === 'function' && a.valueOf() === b.valueOf());
      },
      extend: function (target) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
          var keys = Object.keys(source);
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var descriptor = Object.getOwnPropertyDescriptor(source, key);
            if (descriptor !== undefined && descriptor.enumerable)
              Object.defineProperty(target, key, descriptor);
          }
        });
        return target;
      },
      forEachProperty: forEachProperty,
      hasOwn: hasOwn
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
        contains: function (element) {
          return this.tryFirstIndexOf(element) >= 0;
        },
        filter: function (predicate) {
          var array = [];
          for (var i = 0; i < this.length; ++i) {
            var element = this.get(i);
            if (predicate(element, i, this))
              array.push(element);
          }
          return new ArrayList(array);
        },
        forEach: function (action) {
          for (var i = 0, length = this.length; i < length; ++i)
            action(this.get(i), i, this);
        },
        get: function (index) {
          return this['get'](index);
        },
        map: function (mapping) {
          var array = new Array(this.length);
          for (var i = 0; i < this.length; ++i)
            array[i] = mapping(this.get(i), i, this);
          return new ArrayList(array);
        },
        readOnly: function () {
          return new ReadOnlyListView(this);
        },
        slice: function (start, end) {
          var length = this.length;
          start = arguments.length <= 0 ? 0 : start >= 0 ? start : length + start;
          end = arguments.length <= 1 ? length : end >= 0 ? end : length + end;
          var resultLength = end - start;
          var array = new Array(resultLength);
          for (var i = 0; i < resultLength; ++i) {
            array[i] = this.get(start + i);
          }
          return new ArrayList(array);
        },
        toArray: function () {
          var array = new Array(this.length);
          this.forEach(function (element, index) {
            array[index] = element;
          });
          return array;
        },
        tryFirstIndexOf: function (element) {
          for (var i = 0; i < this.length; ++i)
            if (this.get(i) === element)
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
        'slice': internal.slice,
        'toArray': internal.toArray,
        'tryFirstIndexOf': internal.tryFirstIndexOf
      };
      return js.objects.extend(internal, exported, extensions);
    }
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
    function findInsertionIndex(elements, ordering, element, fromIndex, toIndex) {
      if (fromIndex >= toIndex)
        return fromIndex;
      var middle = Math.floor((fromIndex + toIndex) / 2);
      return ordering(element, elements[middle]) < 0 ? findInsertionIndex(elements, ordering, element, fromIndex, middle) : findInsertionIndex(elements, ordering, element, middle + 1, toIndex);
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
      this.elements = [];
      this.elementIdToIndex = {};
      this.ordering = null;
    }
    IndexedList.prototype = lists.listPrototype({
      get length() {
        return this.elements.length;
      },
      get: function (index) {
        return this.elements[index];
      },
      getById: function (id) {
        var index = indexOfById(this.elementIdToIndex, id);
        return this.elements[index];
      },
      clear: function () {
        this.elements = [];
        this.elementIdToIndex = {};
      },
      contains: function (element) {
        var id = idOf(this.idSelector, element);
        return tryIndexOfById(this.elementIdToIndex, id) >= 0;
      },
      containsById: function (id) {
        return tryIndexOfById(this.elementIdToIndex, id) >= 0;
      },
      defineOrdering: function (ordering) {
        var idSelector = this.idSelector;
        var elements = this.elements;
        var elementIdToIndex = this.elementIdToIndex;
        this.ordering = ordering;
        js.arrays.stableSort(elements, ordering);
        var reordered = false;
        for (var i = 0; i < elements.length; ++i) {
          var id = idSelector(elements[i]);
          reordered = reordered || elementIdToIndex[id] !== i;
          elementIdToIndex[id] = i;
        }
        return reordered;
      },
      removeAllById: function (ids) {
        if (!ids.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.elements;
        var elementIdToIndex = this.elementIdToIndex;
        var indicesOffsetBy1 = ids.map(function (id) {
          return indexOfById(elementIdToIndex, id) + 1;
        });
        indicesOffsetBy1.sort(function (a, b) {
          return a - b;
        });
        this.elements = reconstructElements(idSelector, elements, elementIdToIndex, indicesOffsetBy1, function (newArray) {
          var row = newArray.pop();
          var id = idSelector(row);
          delete elementIdToIndex[id];
        });
      },
      removeAll: function (elements) {
        this.removeAllById(elements.map(this.idSelector));
      },
      updateAll: function (updatedElements) {
        if (this.ordering)
          throw new Error('`updateAll` must not be called on an ordered `IndexedTable`. Use a combination of order-preserving' + ' `tryUpdateAll`, `removeAll` and `insertAll` instead.');
        if (!updatedElements.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.elements;
        var elementIdToIndex = this.elementIdToIndex;
        updatedElements.forEach(function (element) {
          var index = indexOfById(elementIdToIndex, idSelector(element));
          elements[index] = element;
        });
      },
      tryUpdateAll: function (updatedElements) {
        if (!this.ordering)
          throw new Error('`tryUpdateAll` is designed for ordered `IndexedTable`s. For unordered ones, use `updateAll` instead.');
        if (!updatedElements.length)
          return [];
        var idSelector = this.idSelector;
        var elements = this.elements;
        var elementIdToIndex = this.elementIdToIndex;
        var ordering = this.ordering;
        var failed = [];
        updatedElements.forEach(function (row) {
          var index = indexOfById(elementIdToIndex, idSelector(row));
          // TODO the below check is good (quick and easy), but when it fails we should check if the
          //      updated element is still greater/less than the one before/after before failing it
          if (ordering(row, elements[index]) !== 0)
            failed.push(row);
          else
            elements[index] = row;
        });
        return failed;
      },
      addAll: function (newElements) {
        if (this.ordering)
          throw new Error('`addAll` must not be called on an ordered `IndexedTable`. Use order-preserving `insertAll` instead.');
        if (!newElements.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.elements;
        var elementIdToIndex = this.elementIdToIndex;
        newElements.forEach(function (row) {
          var id = idSelector(row);
          if (js.objects.hasOwn(elementIdToIndex, id))
            throw new Error('The list already contains an element with id `' + id + '`. Did you mean to call `updateAll`?.');
          elementIdToIndex[id] = elements.push(row) - 1;
        });
      },
      insertAll: function (newElements) {
        if (!this.ordering)
          throw new Error('`insertAll` is designed for ordered `IndexedTable`s. For unordered ones, use `addAll` instead.');
        if (!newElements.length)
          return;
        var idSelector = this.idSelector;
        var elements = this.elements;
        var elementIdToIndex = this.elementIdToIndex;
        var ordering = this.ordering;
        js.arrays.stableSort(newElements, ordering);
        var offset = 0;
        var indices = [];
        newElements.forEach(function (newElement) {
          var insertionIndex = findInsertionIndex(elements, ordering, newElement, offset, elements.length);
          indices.push(insertionIndex);
          offset = insertionIndex;
        });
        offset = 0;
        this.elements = reconstructElements(idSelector, elements, elementIdToIndex, indices, function (newArray) {
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
  var ko_data_source_delta, ko_data_source_views_subviews, ko_data_source_views_abstract_view, ko_data_source_views_root_view, ko_data_source_views_filtered_view, ko_data_source_views_ordered_view, ko_data_source_views_clipped_view, ko_data_source_views_views, ko_data_source_client_side_data_source, ko_data_source_default_observable_state_transitioner, ko_data_source_observable_entries, ko_data_source_ko_data_source, ko_data_source;
  ko_data_source_delta = function () {
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
  ko_data_source_views_subviews = {};
  ko_data_source_views_abstract_view = function (ko, js, IndexedList, Delta, subviews) {
    function AbstractView(parent, indexedValues, deltas) {
      this.parent = parent;
      this.indexedValues = indexedValues || new IndexedList(this.idSelector);
      this.deltas = deltas || ko.observable(new Delta());
      this._values = ko.observable(this.indexedValues.readOnly());
      this._observables = null;
    }
    AbstractView.prototype = {
      get idSelector() {
        return this.parent.idSelector;
      },
      get observableEntries() {
        return this.parent.observableEntries;
      },
      get getValues() {
        return this._values;
      },
      get getObservables() {
        if (!this._observables)
          this._observables = ko.observable(this.indexedValues.map(this.observableEntries.addReference));
        return this._observables;
      },
      get values() {
        return this.getValues;
      },
      get observables() {
        return this.getObservables;
      },
      synchronizeObservables: function (delta) {
        this._values.valueHasMutated();
        if (this._observables) {
          delta.added.forEach(this.observableEntries.addReference);
          this._observables(this.indexedValues.map(this.observableEntries.lookup));
          delta.removed.forEach(this.observableEntries.releaseReference);
        }
      },
      releaseObservableReferences: function () {
        if (this._observables)
          this.indexedValues.forEach(this.observableEntries.releaseReference);
      },
      filteredBy: function (predicate) {
        return new subviews.FilteredView(this, predicate);
      },
      orderedBy: function (ordering) {
        return new subviews.OrderedView(this, ordering);
      },
      clipped: function (offset, size) {
        return new subviews.ClippedView(this, offset, size);
      },
      dispose: function () {
        this['dispose']();
      }
    };
    Object.defineProperty(AbstractView.prototype, 'values', {
      'enumerable': true,
      'get': function () {
        return this.getValues;
      }
    });
    Object.defineProperty(AbstractView.prototype, 'observables', {
      'enumerable': true,
      'get': function () {
        return this.getObservables;
      }
    });
    AbstractView.prototype['filteredBy'] = AbstractView.prototype.filteredBy;
    AbstractView.prototype['orderedBy'] = AbstractView.prototype.orderedBy;
    AbstractView.prototype['clipped'] = AbstractView.prototype.clipped;
    return AbstractView;
  }(knockout, onefold_js, indexed_list, ko_data_source_delta, ko_data_source_views_subviews);
  ko_data_source_views_root_view = function (ko, js, AbstractView) {
    function RootView(idSelector, observableEntries, values, deltas) {
      AbstractView.call(this, {
        idSelector: idSelector,
        observableEntries: observableEntries
      }, values, deltas);
      this.deltaSubscription = deltas.subscribe(function (delta) {
        this.synchronizeObservables(delta);
      }.bind(this));
    }
    RootView.prototype = js.objects.extend({}, AbstractView.prototype, {
      'dispose': function () {
        this.deltaSubscription.dispose();
        this.releaseObservableReferences();
      }
    });
    return RootView;
  }(knockout, onefold_js, ko_data_source_views_abstract_view);
  ko_data_source_views_filtered_view = function (ko, js, Delta, AbstractView, subviews) {
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
      this.computer = ko.computed(function () {
        var oldValues = this.indexedValues.toArray();
        var newValues = this.parent.indexedValues.filter(ko.unwrap(predicate)).toArray();
        var delta = new Delta(newValues, [], oldValues);
        this.indexedValues.clear();
        this.indexedValues.addAll(newValues);
        this.synchronizeObservables(delta);
        delta.propagateTo(this.deltas);
      }.bind(this));
      this.deltaSubscription = parent.deltas.subscribe(function (delta) {
        var filtered = filterDelta(this.idSelector, this.indexedValues, delta, ko.unwrap(predicate));
        if (filtered.empty)
          return;
        this.indexedValues.removeAll(filtered.removed);
        this.indexedValues.updateAll(filtered.updated);
        this.indexedValues.addAll(filtered.added);
        this.synchronizeObservables(delta);
        filtered.propagateTo(this.deltas);
      }.bind(this));
    }
    FilteredView.prototype = js.objects.extend({}, AbstractView.prototype, {
      'dispose': function () {
        this.computer.dispose();
        this.deltaSubscription.dispose();
        this.releaseObservableReferences();
      }
    });
    subviews.FilteredView = FilteredView;
    return FilteredView;
  }(knockout, onefold_js, ko_data_source_delta, ko_data_source_views_abstract_view, ko_data_source_views_subviews);
  ko_data_source_views_ordered_view = function (ko, js, AbstractView, subviews) {
    function OrderedView(parent, ordering) {
      AbstractView.call(this, parent);
      this.indexedValues.addAll(parent.indexedValues.toArray());
      this.computer = ko.computed(function () {
        if (this.indexedValues.defineOrdering(ko.unwrap(ordering)))
          this.deltas.valueHasMutated();
      }.bind(this));
      this.deltaSubscription = parent.deltas.subscribe(function (delta) {
        var failedUpdates = this.indexedValues.tryUpdateAll(delta.updated);
        this.indexedValues.removeAll(delta.removed.concat(failedUpdates));
        this.indexedValues.insertAll(delta.added.concat(failedUpdates));
        this.synchronizeObservables(delta);
        this.deltas.valueHasMutated();
      }.bind(this));
    }
    OrderedView.prototype = js.objects.extend({}, AbstractView.prototype, {
      'filteredBy': function () {
        throw new Error('Filtering an ordered view is not supported.');
      },
      'orderedBy': function () {
        throw new Error('Ordering an ordered view is not supported.');
      },
      'dispose': function () {
        this.computer.dispose();
        this.deltaSubscription.dispose();
        this.releaseObservableReferences();
      }
    });
    subviews.OrderedView = OrderedView;
    return OrderedView;
  }(knockout, onefold_js, ko_data_source_views_abstract_view, ko_data_source_views_subviews);
  ko_data_source_views_clipped_view = function (ko, js, lists, subviews) {
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
    function ClippedView(parent, offset, size) {
      var observableEntries = parent.observableEntries;
      this.__observableEntries = observableEntries;
      this.__values = ko.observable(lists.newArrayList());
      this.__observables = null;
      var idSelector = parent.idSelector;
      this.computer = ko.computed(function () {
        // the delta isn't worth much to clipping, so we reuse the computer
        parent.deltas();
        var unclipped = parent.indexedValues;
        var from = Math.min(unclipped.length, ko.unwrap(offset));
        var to = Math.min(unclipped.length, from + ko.unwrap(size));
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
      get getValues() {
        return this.__values;
      },
      get getObservables() {
        if (!this.__observables)
          this.__observables = ko.observable(this.values().map(this.__observableEntries.addReference));
        return this.__observables;
      },
      get values() {
        return this.getValues;
      },
      get observables() {
        return this.getObservables;
      },
      filteredBy: function () {
        throw new Error('Filtering a clipped view is not supported.');
      },
      orderedBy: function () {
        throw new Error('Ordering a clipped view is not supported.');
      },
      clipped: function () {
        throw new Error('Clipping a clipped view is not supported.');
      },
      dispose: function () {
        this.computer.dispose();
        if (this.__observables)
          this.__values().forEach(this.__observableEntries.releaseReference);
      }
    });
    Object.defineProperty(ClippedView.prototype, 'values', {
      'enumerable': true,
      'get': function () {
        return this.getValues;
      }
    });
    Object.defineProperty(ClippedView.prototype, 'observables', {
      'enumerable': true,
      'get': function () {
        return this.getObservables;
      }
    });
    ClippedView.prototype['filteredBy'] = ClippedView.prototype.filteredBy;
    ClippedView.prototype['orderedBy'] = ClippedView.prototype.orderedBy;
    ClippedView.prototype['clipped'] = ClippedView.prototype.clipped;
    ClippedView.prototype['dispose'] = ClippedView.prototype.dispose;
    subviews.ClippedView = ClippedView;
    return ClippedView;
  }(knockout, onefold_js, onefold_lists, ko_data_source_views_subviews);
  ko_data_source_views_views = function (RootView) {
    return { RootView: RootView };
  }(ko_data_source_views_root_view);
  ko_data_source_client_side_data_source = function (ko, js, IndexedList, views, Delta) {
    return function ClientSideDataSource(idSelector, observableEntries) {
      var values = new IndexedList(idSelector);
      var deltas = ko.observable(new Delta());
      this.openEntryView = function (entryId) {
        var optionalEntryView = this.openOptionalEntryView(entryId);
        var subscription = null;
        return {
          value: optionalEntryView.value.bind(optionalEntryView),
          observable: function () {
            if (!subscription) {
              subscription = optionalEntryView.optionalObservable().subscribe(function () {
                throw new Error('Es ist noch eine nicht-optionale View zum entfernten Eintrag offen.');
              });
            }
            return optionalEntryView.observable();
          },
          dispose: function () {
            if (subscription)
              subscription.dispose();
            optionalEntryView.dispose();
          }
        };
      }.bind(this);
      this.openOptionalEntryView = function (entryId) {
        var disposed = false;
        var lastKnownValue = null;
        var observable = null;
        var optionalObservable = null;
        var subscription = null;
        var assertNotDisposed = function () {
          if (disposed)
            throw new Error('Ung\xFCltiger Zustand: Diese Entry-View wurde bereits freigegeben.');
        };
        var optionalEntryView = {
          value: function () {
            assertNotDisposed();
            lastKnownValue = values.getById(entryId);
            return lastKnownValue;
          },
          observable: function () {
            assertNotDisposed();
            if (!observable)
              observable = observableEntries.addReference(optionalEntryView.value());
            return observable;
          },
          optionalObservable: function () {
            assertNotDisposed();
            if (optionalObservable)
              return optionalObservable;
            var sharedObservable = observableEntries.addOptionalReference(optionalEntryView.value());
            observable = sharedObservable();
            optionalObservable = ko.observable({
              present: true,
              value: optionalEntryView.observable()
            });
            subscription = sharedObservable.subscribe(function () {
              optionalObservable({
                present: false,
                value: optionalEntryView.observable()
              });
            });
            return optionalObservable;
          },
          dispose: function () {
            assertNotDisposed();
            disposed = true;
            if (subscription) {
              subscription.dispose();
              subscription = null;
              observableEntries.releaseReference(lastKnownValue);
              observable = null;
            }
          }
        };
        return optionalEntryView;
      };
      this.openView = function () {
        return new views.RootView(idSelector, observableEntries, values, deltas);
      };
      this['openView'] = this.openView;
      this['addEntries'] = function (newEntries) {
        values.addAll(newEntries);
        new Delta(newEntries).propagateTo(deltas);
      };
      this['updateEntries'] = function (updatedEntries) {
        values.updateAll(updatedEntries);
        new Delta([], updatedEntries).propagateTo(deltas);
        observableEntries.updateEntries(updatedEntries);
      };
      this['addOrUpdateEntries'] = function (entries) {
        var added = [];
        var updated = [];
        entries.forEach(function (entry) {
          (values.contains(entry) ? updated : added).push();
        });
        new Delta(added, updated).propagateTo(deltas);
      };
      this['removeEntries'] = function (entries) {
        values.removeAll(entries);
        new Delta([], [], entries).propagateTo(deltas);
      };
      this['replaceEntries'] = function (newEntries) {
        var removedEntries = values.toArray();
        values.clear();
        values.addAll(newEntries);
        new Delta(newEntries, [], removedEntries).propagateTo(deltas);
        // TODO update only those that were already there before the delta was propagated
        observableEntries.updateEntries(newEntries);
      };
      this.dispose = function () {
      };
    };
  }(knockout, onefold_js, indexed_list, ko_data_source_views_views, ko_data_source_delta);
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
    var Entry = function (observable) {
      this.observable = observable;
      this.optionalObservable = ko.observable(observable);
      this.refcount = 1;
    };
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
        throw new Error('Ids m\xFCssen Strings sein. Unerwartete Id \'' + id + '\' des Typs \'' + typeof id + '\'.');
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
        var entry = new Entry(observableStateTransitioner.constructor(value));
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
  }(ko_data_source_client_side_data_source, ko_data_source_default_observable_state_transitioner, ko_data_source_observable_entries);
  ko_data_source = function (main) {
    return main;
  }(ko_data_source_ko_data_source);
  return ko_data_source;
}(indexed_list, onefold_lists, onefold_js, knockout);
onefold_dom = function () {
  var onefold_dom_internal, onefold_dom;
  onefold_dom_internal = function () {
    function addClass(classes, classToAdd) {
      return removeClass(classes, classToAdd) + ' ' + classToAdd;
    }
    function isClassPresent(classes, classToCheckFor) {
      return (' ' + classes + ' ').indexOf(' ' + classToCheckFor + ' ') >= 0;
    }
    function removeClass(classes, classToRemove) {
      var raw = (' ' + classes + ' ').replace(' ' + classToRemove + ' ', ' ');
      var from = raw[0] === ' ' ? 1 : 0;
      var to = raw[raw.length - 1] === ' ' ? raw.length - 1 : raw.length;
      return raw.substring(from, to);
    }
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
    var matches = Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
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
      },
      classes: {
        add: addClass,
        isPresent: isClassPresent,
        remove: removeClass
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
    var requestAnimationFrame = window.requestAnimationFrame, cancelAnimationFrame = window.cancelAnimationFrame;
    function ElementWithBindingContext(element, bindingContext) {
      var self = this;
      self.element = element;
      self.bindingContext = bindingContext;
    }
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
        else if (!addedItems.length)
          return false;
        else if (configuration.allowElementRecycling && carcasses.length)
          performNecromancy(carcasses.pop(), addedItems.shift());
        else
          insertElementFor(addedItems.shift());
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
      function finalizeSynchronization() {
        for (var i = 0; i < carcasses.length; ++i)
          ko.removeNode(carcasses[i]);
        synchronizedCount = currentItems.length();
        reset();
        reportSynchronization();
      }
      function abortActiveSynchronization() {
        cancelAnimationFrame(animationFrameRequest);
        animationFrameRequest = null;
        for (var i = 0; carcasses !== null && i < carcasses.length; ++i) {
          var element = carcasses[i];
          itemElements.add(idFor(element), new ElementWithBindingContext(element, ko.contextFor(element)));
        }
        reset();
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
        if (animationFrameRequest)
          abortActiveSynchronization();
        startNewSynchronization(newItems);
      };
      self.abortActiveSynchronization = abortActiveSynchronization;
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
            synchronizer.startOrRestartSynchronization(newItems);
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
ko_grid = function (onefold_dom, onefold_js, ko_indexed_repeat, knockout) {
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
            throw new Error('The column id `' + id + '` is already taken.');
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
        this._combinedWidthInPixels = ko.computed(function () {
          var sum = 0;
          var displayed = this.displayed();
          for (var i = 0; i < displayed.length; ++i)
            sum += displayed[i].widthInPixels();
          return sum;
        }.bind(this));
        this['_combinedWidthInPixels'] = this._combinedWidthInPixels;
        disposables.push(this._combinedWidthInPixels);
        this.add = function (column) {
          var viewModel = createColumn({
            'id': '#' + column.id,
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
    function Column(grid, gridConfig, column) {
      this.id = column['id'];
      this['id'] = this.id;
      this.property = column['property'] || this.id;
      this['property'] = this.property;
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
    function ApplicationEventHandler(handler, selector) {
      this.handler = handler;
      this.selector = selector;
    }
    return function ApplicationEventDispatcher(argumentsSupplier) {
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
    };
  }(onefold_js, onefold_dom);
  text_ko_grid_datahtmltemplate = '<tbody class="ko-grid-tbody" data-bind="_gridWidth: columns._combinedWidthInPixels() + \'px\'">\n    <!--before:tbody-->\n    <tr class="ko-grid-tr ko-grid-row"\n        data-bind="indexedRepeat: {\n            forEach: data.rows.displayed,\n            indexedBy: function(r) { return grid.data.observableValueSelector(ko.unwrap(r[grid.primaryKey])); },\n            as: \'row\',\n            at: \'rowIndex\',\n            allowDeviation: true,\n            onDeviation: data.rows.__handleDisplayedRowsDeviate,\n            onSynchronization: data.rows.__handleDisplayedRowsSynchronized }"\n        data-repeat-bind="__gridRow: { classify: grid.data.rows.__classify, row: row, index: rowIndex }">\n\n        <td data-bind="indexedRepeat: { forEach: columns.displayed, indexedBy: \'id\', as: \'column\', allowElementRecycling: false }"\n            data-repeat-bind="__gridCell: { row: row, column: column }"></td>\n    </tr>\n    <!--after:tbody-->\n</tbody>';
  ko_grid_data = function (ko, js, ApplicationEventDispatcher, dataTemplate) {
    var ELEMENT_NODE = window.Node.ELEMENT_NODE;
    var INDIFFERENT_COMPARATOR = js.functions.zero;
    var document = window.document;
    var data = {
      INDIFFERENT_COMPARATOR: INDIFFERENT_COMPARATOR,
      init: function (template) {
        template.replace('body').with(dataTemplate);
      },
      Constructor: function (bindingValue, config, grid) {
        var disposeCallbacks = [];
        this.source = bindingValue['dataSource'];
        this.valueSelector = bindingValue['valueSelector'] || config['valueSelector'] || js.functions.identity;
        this['valueSelector'] = this.valueSelector;
        this.observableValueSelector = bindingValue['observableValueSelector'] || config['observableValueSelector'] || this.valueSelector;
        this['observableValueSelector'] = this.observableValueSelector;
        this.predicates = ko.observableArray(bindingValue.filters || []);
        this['predicates'] = this.predicates;
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
        disposeCallbacks.push(initRows.call(this, grid));
        disposeCallbacks.push(initEventDispatching.call(this, grid));
        disposeCallbacks.push(initElementLookup.call(this, grid));
        this._dispose = function () {
          disposeCallbacks.forEach(function (callback) {
            callback();
          });
        };
      }.bind(this)
    };
    function initTbodyElement(grid) {
      this.__postApplyBindings(function (inner) {
        inner();
        this.__tbodyElement = grid._rootElement.querySelector('.ko-grid-tbody');
      }.bind(this));
      return function () {
        this.__tbodyElement = null;
      }.bind(this);
    }
    function initRows() {
      var disposables = [];
      var predicate = ko.pureComputed(function () {
        var predicates = this.predicates().map(ko.unwrap);
        return function (row) {
          for (var i = 0; i < predicates.length; i++)
            if (!predicates[i](row))
              return false;
          return true;
        };
      }.bind(this));
      var comparator = ko.pureComputed(function () {
        return this.comparator();
      }.bind(this));
      var rows = {};
      this.rows = rows;
      this['rows'] = rows;
      rows.all = ko.observableArray([]);
      rows.filtered = ko.observableArray([]);
      rows['filtered'] = rows.filtered;
      rows.ordered = ko.observableArray([]);
      rows['ordered'] = rows.ordered;
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
        var allRows = this.source.openView();
        var filteredView = allRows.filteredBy(predicate);
        var orderedView = this.rows.__orderedView = filteredView.orderedBy(comparator);
        var pageView = orderedView.clipped(this.offset, this.limit);
        disposables.push(allRows, filteredView, orderedView, pageView);
        disposables.push(allRows.values.subscribe(function (v) {
          this.rows.all(v);
        }.bind(this)), filteredView.values.subscribe(function (v) {
          this.rows.filtered(v);
        }.bind(this)), orderedView.values.subscribe(function (v) {
          this.rows.ordered(v);
        }.bind(this)), pageView.observables.subscribe(function (v) {
          this.rows.displayed(v);
        }.bind(this)));
        rows.all(allRows.values());
        rows.filtered(filteredView.values());
        rows.ordered(orderedView.values());
        rows.displayed(pageView.observables());
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
            var rowObservable = ko.contextFor(element).row();
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
  text_ko_grid_headershtmltemplate = '<thead class="ko-grid-thead" data-bind="_gridWidth: columns._combinedWidthInPixels() + \'px\'">\n    <!--before:thead-->\n    <tr class="ko-grid-tr ko-grid-headers"\n        data-bind="indexedRepeat: { forEach: headers.__rows, indexedBy: \'__rowId\', as: \'headerRow\' }"\n        data-repeat-bind="click: headers.__handleClick">\n\n        <th class="ko-grid-th"\n            data-bind="indexedRepeat: { forEach: headerRow(), indexedBy: \'id\', as: \'header\' }"\n            data-repeat-bind="__gridHeader: header"></th>\n    </tr>\n    <!--after:thead-->\n</thead>';
  ko_grid_headers = function (ko, js, ApplicationEventDispatcher, headersTemplate) {
    var document = window.document;
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
        template.replace('head').with('headers', headersTemplate);
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
          var $__arguments = arguments;
          var selectorSpecified = $__arguments.length > 1;
          handler = selectorSpecified ? handler : selectorOrHandler;
          var wrappedHandler = function (event, header) {
            var $__arguments0 = arguments;
            if (header instanceof ColumnHeader)
              handler.apply(this, $__arguments0);
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
      }.bind(this)
    };
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
        while (element.firstChild)
          ko.removeNode(element.firstChild);
        element.appendChild(document.createTextNode(''));
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
        element.firstChild.nodeValue = header.label();
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
          recalculate();
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
      }.bind(this)
    };
    var initScolling = function (grid) {
      var gridElement = grid._rootElement.querySelector('.ko-grid');
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
      var gridElement = grid._rootElement.querySelector('.ko-grid');
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
      // This is a quick check to see if the element is layed out. The check assumes
      // that neither the grid nor any of its containers has a fixed position.
      if (element.offsetParent)
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
      return extension;
    }
    function lookUpExtension(extensionId) {
      if (!js.objects.hasOwn(extensions, extensionId))
        throw new Error('No known extension id or alias: `' + extensionId + '`.');
      return extensions[extensionId];
    }
    grid.defineExtension = function (extensionId, extensionSpec) {
      return registerExtension(extensionId, new GridExtension(extensionSpec));
    };
    grid.lookUpExtension = lookUpExtension;
    grid.declareExtensionAlias = function (extensionAlias, extensionId) {
      return registerExtension(extensionAlias, grid.lookUpExtension(extensionId));
    };
    function GridExtension(extensionSpec) {
      this.dependencies = extensionSpec.dependencies || [];
      this.initializer = extensionSpec.initializer || js.functions.nop;
      this.Constructor = extensionSpec.Constructor;
    }
    return extensions;
  }(knockout, onefold_js);
  text_ko_grid_gridhtmltemplate = '<div class="ko-grid">\n    <!--before:grid-->\n    <div class="ko-grid-table-container">\n        <!--before:table-->\n        <div class="ko-grid-table-scroller-padding">\n            <div class="ko-grid-table-scroller">\n                <table class="ko-grid-table" data-bind="_gridWidth: columns._combinedWidthInPixels() + \'px\'">\n                    <!--columns-->\n                    <!--head-->\n                    <tfoot class="ko-grid-tfoot" data-bind="_gridWidth: columns._combinedWidthInPixels() + \'px\'"><!--tfoot--></tfoot>\n                    <!--body-->\n                </table>\n            </div>\n        </div>\n        <!--after:table-->\n    </div>\n    <!--after:grid-->\n</div>';
  ko_grid_binding = function (req, ko, js) {
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
    function Grid(element, bindingValue) {
      this.elementId = element.id;
      this['elementId'] = this.elementId;
      this.primaryKey = bindingValue['primaryKey'];
      this['primaryKey'] = this.primaryKey;
      this._rootElement = element;
      this._classes = ko.observableArray([]);
      this._dispose = js.functions.nop;
    }
    ko.bindingHandlers['grid']['init'] = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var bindingValue = valueAccessor();
      loadConfig(bindingValue['config'], function (config, templateName, extensionLoadOrder) {
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
        var configExtensions = config['extensions'];
        var bindingExtensions = bindingValue['extensions'];
        var gridExtensions = grid['extensions'] = {};
        extensionLoadOrder.forEach(function (extensionName) {
          var extension = koGrid.lookUpExtension(extensionName);
          var extensionConfig = configExtensions[extensionName];
          var extensionBindingValue = bindingExtensions ? bindingExtensions[extensionName] || {} : {};
          if (extensionConfig['enabled'] === false && extensionBindingValue['enabled'] !== true || extensionBindingValue['enabled'] === false)
            return;
          extension.dependencies.forEach(function (dependency) {
            if (!gridExtensions[dependency])
              throw new Error('Dependency \'' + dependency + '\' was disabled.');
          });
          var instance = new extension.Constructor(extensionBindingValue, extensionConfig, grid, bindingValue, config);
          gridExtensions[extensionName] = instance;
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
        js.objects.forEachProperty(configExtensions, function (extensionName) {
          gridElement.className += ' with-' + js.strings.convertCamelToHyphenCase(extensionName);
        });
        coreComponentNames.forEach(function (n) {
          if (grid[n]._postApplyBindings)
            grid[n]._postApplyBindings();
        });
      });
      return { 'controlsDescendantBindings': true };
    };
    ko.bindingHandlers['grid']['update'] = js.functions.nop;
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
        var configExtensions = config['extensions'];
        var loadedExtensions = [];
        var loadingExtensions = [];
        var loadExtension = function (extensionName) {
          var extension = koGrid.lookUpExtension(extensionName);
          if (js.arrays.contains(loadedExtensions, extensionName))
            return;
          if (!extension)
            throw new Error('Extension  \'' + extensionName + '\' is not defined/loaded.');
          if (js.arrays.contains(loadingExtensions, extensionName))
            throw new Error('Dependency-Cycle: .. -> ' + loadingExtensions.join(' -> ') + ' -> ' + extensionName + ' -> ..');
          if (!configExtensions[extensionName])
            throw new Error('The extension \'' + extensionName + '\' must be configured (configuration: \'' + configName + '\')');
          loadingExtensions.push(extensionName);
          extension.dependencies.forEach(loadExtension);
          extension.initializer(template, configExtensions[extensionName], config);
          if (loadingExtensions.pop() !== extensionName)
            throw new Error('Assertion error.');
          loadedExtensions.push(extensionName);
        };
        js.objects.forEachProperty(configExtensions, loadExtension);
        var templateName = 'grid-template-' + configName;
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
}(onefold_dom, onefold_js, ko_indexed_repeat, knockout);
ko_grid_aggregate = function (onefold_dom, onefold_js, ko_grid, ko_indexed_repeat, knockout) {
  var ko_grid_aggregate_aggregate, ko_grid_aggregate;
  ko_grid_aggregate_aggregate = function (ko, koGrid) {
    function renderNumber(value) {
      if (Math.abs(value) >= 1)
        return value.toLocaleString();
      else {
        var firstNonZeroFractionDigit = -Math.floor(Math.log(value) / Math.log(10));
        return value.toLocaleString(undefined, { maximumFractionDigits: firstNonZeroFractionDigit + 1 });
      }
    }
    koGrid.defineExtension('ko-grid-aggregate', {
      initializer: function (template) {
        template.to('tfoot').prepend('aggregates', [
          '<tr class="ko-grid-tr" data-bind="indexedRepeat: {',
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
        var computer = ko.computed(function () {
          var statistics = {};
          var rows = grid.data.rows.all();
          var count = rows.length;
          propertiesOfInterest.forEach(function (p) {
            statistics[p] = {
              'minimum': Number.POSITIVE_INFINITY,
              'maximum': Number.NEGATIVE_INFINITY,
              'sum': 0
            };
          });
          rows.forEach(function (row) {
            propertiesOfInterest.forEach(function (p) {
              var propertyStatistics = statistics[p];
              var value = grid.data.valueSelector(row[p]);
              propertyStatistics['minimum'] = Math.min(propertyStatistics['minimum'], value);
              propertyStatistics['maximum'] = Math.max(propertyStatistics['maximum'], value);
              propertyStatistics['sum'] += value;
            });
          });
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
        });
        this.dispose = function () {
          computer.dispose();
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
    return koGrid.declareExtensionAlias('aggregate', 'ko-grid-aggregate');
  }(knockout, ko_grid);
  ko_grid_aggregate = function (main) {
    return main;
  }(ko_grid_aggregate_aggregate);
  return ko_grid_aggregate;
}(onefold_dom, onefold_js, ko_grid, ko_indexed_repeat, knockout);
ko_grid_links = function (onefold_dom, onefold_js, ko_grid, ko_indexed_repeat, knockout) {
  var ko_grid_links_links, ko_grid_links;
  ko_grid_links_links = function (ko, koGrid) {
    koGrid.defineExtension('ko-grid-links', {
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
    return koGrid.declareExtensionAlias('links', 'ko-grid-links');
  }(knockout, ko_grid);
  ko_grid_links = function (main) {
    return main;
  }(ko_grid_links_links);
  return ko_grid_links;
}(onefold_dom, onefold_js, ko_grid, ko_indexed_repeat, knockout);
ko_grid_sorting = function (onefold_dom, onefold_js, ko_grid, ko_indexed_repeat, knockout) {
  var ko_grid_sorting_sorting, ko_grid_sorting;
  ko_grid_sorting_sorting = function (koGrid) {
    var DIRECTION_ASCENDING = 'ascending';
    var DIRECTION_DESCENDING = 'descending';
    var CLASS_ASCENDING_ORDER = 'ascending-order';
    var CLASS_DESCENDING_ORDER = 'descending-order';
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
    koGrid.defineExtension('ko-grid-sorting', {
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
            var propertyInitiallySortDirection = bindingValue.initiallySortDirection;
            if (propertyInitiallySortDirection) {
              direction = propertyInitiallySortDirection === DIRECTION_DESCENDING ? DIRECTION_DESCENDING : DIRECTION_ASCENDING;
            } else {
              direction = DIRECTION_ASCENDING;
            }
            ordering = new Ordering(defaultComparator(column));
            if (direction === DIRECTION_DESCENDING) {
              ordering = ordering.reverse();
            }
          }
          var classes = sortedByColumn.headerClasses().filter(function (c) {
            return c !== CLASS_ASCENDING_ORDER && c !== CLASS_DESCENDING_ORDER;
          });
          classes.push(direction === DIRECTION_ASCENDING ? CLASS_ASCENDING_ORDER : CLASS_DESCENDING_ORDER);
          column.headerClasses(classes);
          grid.data.comparator(ordering.comparator);
        };
        if (bindingValue.initiallySortedBy)
          sortBy(grid.columns.byId(bindingValue.initiallySortedBy));
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
    return koGrid.declareExtensionAlias('sorting', 'ko-grid-sorting');
  }(ko_grid);
  ko_grid_sorting = function (main) {
    return main;
  }(ko_grid_sorting_sorting);
  return ko_grid_sorting;
}(onefold_dom, onefold_js, ko_grid, ko_indexed_repeat, knockout);

ko_grid_bundle_bundle = {
  'dataSource': ko_data_source,
  'grid': ko_grid,
  'extensions': {
    'aggregate': ko_grid_aggregate,
    'links': ko_grid_links,
    'sorting': ko_grid_sorting
  }
};
ko_grid_bundle = function (main) {
  return main;
}(ko_grid_bundle_bundle);return ko_grid_bundle;
}));