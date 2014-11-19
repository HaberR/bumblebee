/**
 * Paginated view - it displays controls under the list of items.
 *
 */

define([
    'marionette',
    'backbone',
    'js/components/api_request',
    'js/components/api_query',
    'js/widgets/base/base_widget',
    'hbs!./templates/item-template',
    'hbs!./templates/results-container-template',
    'js/mixins/link_generator_mixin',
    'hbs!./templates/pagination-template',
    'js/mixins/add_stable_index_to_collection',
    'hbs!./templates/empty-view-template',
    'hbs!./templates/initial-view-template',
    './item_view'
  ],

  function (Marionette,
            Backbone,
            ApiRequest,
            ApiQuery,
            BaseWidget,
            ItemTemplate,
            ResultsContainerTemplate,
            LinkGenerator,
            PaginationTemplate,
            WidgetPaginationMixin,
            EmptyViewTemplate,
            InitialViewTemplate,
            ItemView
    ) {


    /**
     * A simple model that holds attributes of the
     * paginated view. Changes in this model are
     * propagated to the view
     */
    var MainViewModel = Backbone.Model.extend({
      defaults: function () {
        return {
          showDetailsButton: false,
          mainResults: false
        }
      }
    });

    /**
     * This is the main view of the list of things. A composite
     * view that holds collection of items.
     */
    var ListOfThingsView = Marionette.CompositeView.extend({

      constructor: function (options) {
        var self = this;
        options = options || {};
        if (options) {
          _.defaults(options, _.pick(this, ['model', 'collectionEvents', 'modelEvents']));
        }
        if (!options.model) {
          options.model = new MainViewModel();
        }
        var args = _.toArray(arguments);
        args[0] = options;
        return Marionette.CompositeView.prototype.constructor.apply(this, args);
      },

      initialize: function (options) {
        this.EmptyViewClass =  Marionette.ItemView.extend({
          template: EmptyViewTemplate
        });
        this.InitialViewClass = Marionette.ItemView.extend({
          template: InitialViewTemplate
        });
      },

      className: "list-of-things",
      itemView: ItemView,
      alreadyRendered: false,

      xshowCollection: function(){
        var ItemView;
        this.collection.each(function(item, index){
          if (item.attributes.visible) {
            ItemView = this.getItemView(item);
            this.addItemView(item, ItemView, index);
          }
        }, this);
      },


      getEmptyView: function () {
        if (this.alreadyRendered)
          return this.EmptyViewClass;
        else {
          this.alreadyRendered = true;
          return this.InitialViewClass;
        }
      },

      itemViewContainer: ".results-list",
      events: {
        "click .show-details": "showDetails",
        "click a[data-paginate]": "changePage",
        "input .per-page": "changePerPage"
      },

      modelEvents: {
        "change": "render"
      },

      template: ResultsContainerTemplate,

      onRender: function () {
        //this.paginationView.setElement(this.$(".pagination-controls")).render();
      },

      /**
       * Displays the are inside of every item-view
       * with details (this place is normally hidden
       * by default)
       */
      showDetails: function (ev) {
        if (ev)
          ev.stopPropagation();
        this.model.set('showDetailsButton', false, {silent: true});

        this.$(".more-info").toggleClass("hide");
        if (this.$(".more-info").hasClass("hide")) {
          this.$(".show-details").text("Show details");
        } else {
          this.$(".show-details").text("Hide details");
        }
      },

      changePage: function (e) {
        var d = $(e.target).data("paginate");
        this.trigger('pagination:select', d);
        e.preventDefault();
      },

      changePerPage: _.debounce(function (e) {
        var perPage = parseInt($(e.target).val());
        this.trigger('pagination:change', perPage);
        e.preventDefault();
      }, 2000)
    });

    return ListOfThingsView;
  });