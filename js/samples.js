goog.require('DD.fx.DragDropHelper');

goog.require('goog.debug');
goog.require('goog.debug.DivConsole');
goog.require('goog.log');

window.onload = function()
{
  var getElement = document.getElementById.bind(document);

  Waves.attach('.waves', ['waves-button']);
  Waves.attach('.off-canvas-list a', ['waves-button']);
  Waves.init();

  window.addEventListener("MSHoldVisual", function(e) {e.preventDefault(); }, false);
  window.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);

  initSample1();
  initSample2();
  initSample3();
  initSample4();
  initSample5();
  /** Sample with pixel threshold */
  initSample6();
  /** Sample with lapse threshold */
  initSample7();
  /** Sample with callbacks */
  initSample8();

  function initSample1 ()
  {
    var source = getElement('original-container-1');
    createItem(source, 10);
    var DragDropHelper = new DD.fx.DragDropHelper(
    {
      'source'            : [source],
      'allowClassNames'   : 'item'
    });
  };

  function initSample2 ()
  {
    var source = getElement('original-container-2');
    createItem(source, 10);
    var DragDropHelper = new DD.fx.DragDropHelper(
    {
      'source'            : [source],
      'allowClassNames'   : 'item',
      'onCreateImage'     : customImage
    });
  };

  function initSample3 ()
  {
    var source = getElement('original-container-3');
    var clone = getElement('original-container-4');
    createItem(source, 10);
    createItem(clone, 10);
    var DragDropHelper = new DD.fx.DragDropHelper(
      {
        'source'            : [clone, source],
        'target'            : [clone, source],
        'allowClassNames'   : 'item',
        'grid'              : [[clone, clone], [source, source]],
        'gridGutter'        : 20,
        'onCreateImage'     : customImage,
        'onDragDrop'        : isEmptyContainer
      });

    function isEmptyContainer(event)
    {
      if (event.dropArea == source && source.children.length == 0)
        source.appendChild(event.dragSource);
      else if (event.dropArea == clone && clone.children.length == 0)
        clone.appendChild(event.dragSource);
    };
  };

  function initSample4 ()
  {
    var source = getElement('original-container-5');
    createItem(source, 50);
    var DragDropHelper = new DD.fx.DragDropHelper(
    {
      'source'            : [source],
      'target'            : [source],
      'allowClassNames'   : 'item',
      'grid'              : [[source, source]],
      'gridGutter'        : 20,
      'onCreateImage'     : customImage,
      'scroll'            : [source],
      'showScrollArea'    : true
    });
  };

  function initSample5 ()
  {
    var source = getElement('original-container-6'),
        alphaCoords = {},
        marginItem = 10,
        lastzIndex = 1,
        style;

    createItem(source, 5, true);

    var DragDropHelper = new DD.fx.DragDropHelper(
    {
      'source'            : [source],
      'target'            : [source],
      'allowClassNames'   : 'item',
      'onCreateImage'     : customImage,
      'onDragDrop'        : putInContainer,
      'onGetDragSource'   : storeStyle
    });

    function storeStyle (event)
    {
      style = event.dragSource.style;
    };

    function putInContainer (event)
    {
      var dropArea = event.dropArea,
          dropAreaOffset = goog.style.getPageOffset(dropArea),
          dragItemSize = goog.style.getSize(event.dragSource),
          x = event.coords.x - dropAreaOffset.x - (dragItemSize.width / 2),
          y = event.coords.y - dropAreaOffset.y - (dragItemSize.height / 2);

      if (x < 0 || y < 0 || y > source.offsetHeight || x > source.offsetWidth)
        event.dragSource.style = style;
      else
      {
        goog.style.setPosition(event.dragSource, x - marginItem, y - marginItem);
        event.dragSource.style.zIndex = lastzIndex++;
      }
    };
  };

  /**
   * Init sample with pixel threshold
   */
  function initSample6 ()
  {
    var source = getElement('container-pt');
    createItem(source, 5);
    var DragDropHelper = new DD.fx.DragDropHelper(
    {
      'source'            : [source],
      'scroll'            : [source],
      'allowClassNames'   : 'item',
      // 'scrollParentMode'  : 'allscroll',
      'onCreateImage'     : customImage,
      'pixelThreshold'    : 20
    });
  };

  /**
   * Init sample with lapse threshold
   */
  function initSample7 ()
  {
    var source = getElement('container-lt');
    createItem(source, 5);
    var DragDropHelper = new DD.fx.DragDropHelper(
    {
      'source'            : [source],
      'scroll'            : [source],
      'allowClassNames'   : 'item',
      // 'scrollParentMode'  : 'allscroll',
      'onCreateImage'     : customImage,
      'lapseThreshold'    : 500
    });
  };

  /**
   * Init sample with callbacks
   */
  function initSample8 ()
  {
    var source = getElement('container-callbacks'),
        consoleContainer = getElement('container-console'),
        console = new goog.debug.DivConsole(consoleContainer),
        theLogger = goog.log.getLogger('');

    createItem(source, 20);

    console.setCapturing(true);
    goog.log.info(theLogger, 'Logging examples');

    var DragDropHelper = new DD.fx.DragDropHelper(
    {
      'source'            : [source],
      'target'            : [source],
      'scroll'            : [source],
      'scroll'            : [source],
      'grid'              : [[source, source]],
      'gridGutter'        : 20,
      'allowClassNames'   : 'item',
      'showScrollArea'    : true,
      'onGetDragSource'   : function(){goog.log.info(theLogger, 'Callback: onGetDragSource')},
      'onDragStart'       : function(){goog.log.info(theLogger, 'Callback: onDragStart')},
      'onDragEnd'         : function(){goog.log.info(theLogger, 'Callback: onDragEnd')},
      'onDragOverScroll'  : function(){goog.log.info(theLogger, 'Callback: onDragOverScroll')},
      'onDragDrop'        : function(){goog.log.info(theLogger, 'Callback: onDragDrop')},
      'onGetDropTarget'   : function(){goog.log.info(theLogger, 'Callback: onGetDropTarget')},
      'onDragOver'        : function(){goog.log.info(theLogger, 'Callback: onDragOver')},
      'onCreateImage'     : function()
      {
        customImage.call(this);
        goog.log.info(theLogger, 'Callback: onCreateImage');
      }
    });
  };


  function createItem(container, count, numClassNames)
  {
    for (var i = 0; i < count; i++)
    {
      var img = goog.dom.createDom('img', {'draggable': false, 'src' : 'img/'+ (Math.floor(Math.random() * (10 - 1 + 1)) + 1) +'.png'});
      var item = goog.dom.createDom('div', {'class' : 'item' + (numClassNames ? ' item-' + i : '')}, [img]);
      container.appendChild(item);
    };
  };

  function customImage()
  {
    debugger;
    var this_ = this,
        item = this.getCopy(),
        img = new Image();
    img.src = item.children[0].src;

    img.onload = function ()
    {
        this_.setCustomDragImage(img);
        
        goog.style.setStyle(this_.DragSource.getDragObject().image_, 
        { 
          'box-shadow' : '0 0 0 2px #fff, 0 0 10px 2px #000'
        });
        
        var dragimg = this_.getItemImage();
        dragimg.style.visibility = 'visible';
        dragimg.style.opacity = 1;
        this_.DragSource.getDragObject().style.display = 'none';
        item.style.display = '';
    };
  };
};