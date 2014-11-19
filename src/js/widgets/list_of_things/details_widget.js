/**
 * Helper class that extends LoT - it is used by widgets that display details
 * of a paper (one identifier search)
 */

define([
  './widget'
],
  function(
    ListOfThings
    ) {
    var DetailsWidget = ListOfThings.extend({
      defaultQueryArguments: {
        fl: 'title,bibcode,author,keyword,pub,aff,volume,year,links_data,ids_data,[citations],property',
        rows : 20,
        start : 0
      },
      customizeQuery: function() {
        var q = ListOfThings.prototype.customizeQuery.apply(this, arguments);
        if (this.sortOrder){
          q.set("sort", this.sortOrder);
        }
        if (this.queryOperator) {
          q.set('q', this.queryOperator + '(' + q.get('q').join(' ') + ')');
        }
        return q;
      },

      extractValueFromQuery: function(apiQuery, key, indexName) {
        if (apiQuery.has(key)) {
          var v = apiQuery.get(key);
          for (var i=0; i< v.length; i++) {
            if (v[i].indexOf(indexName + ':') > -1) {
              var w = v[i].replace(new RegExp(indexName + ':', 'g'), '');
              return w.replace(/\\?\"/g, '');
            }
          }
        }
      }
    });
    return DetailsWidget;
  });