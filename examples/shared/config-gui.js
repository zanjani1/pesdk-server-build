/* global editorConfig, dat */
window.addEventListener('load', function () {
  var gui = new dat.GUI({ closeOnTop: true, autoPlace: true })
  var uiFolder = gui.addFolder('UI')
  var sdkFolder = gui.addFolder('General')
  var editorFolder = gui.addFolder('Editor')

  gui.remember(editorConfig)

  gui.domElement.parentNode.style.zIndex = 1000

  var controllers = []
  controllers.push(uiFolder.add(editorConfig, 'ui.type', ['desktopui', 'reactui']))
  controllers.push(uiFolder.add(editorConfig, 'ui.layout', ['advanced']))
  controllers.push(uiFolder.add(editorConfig, 'ui.theme', ['dark']))

  controllers.push(sdkFolder.add(editorConfig, 'license'))
  controllers.push(sdkFolder.add(editorConfig, 'language', ['en', 'de']))
  controllers.push(sdkFolder.add(editorConfig, 'logLevel', ['trace', 'warn', 'info']))
  controllers.push(sdkFolder.add(editorConfig, 'preloader'))
  controllers.push(sdkFolder.add(editorConfig, 'responsive'))
  controllers.push(sdkFolder.add(editorConfig, 'assets.baseUrl'))

  controllers.push(editorFolder.add(editorConfig, 'editor.preferredRenderer', ['webgl', 'canvas']))
  controllers.push(editorFolder.add(editorConfig, 'editor.maxMegaPixelsOnDesktop', 1, 200))
  controllers.push(editorFolder.add(editorConfig, 'editor.maxMegaPixelsOnMobile', 1, 200))
  controllers.push(editorFolder.add(editorConfig, 'editor.smoothUpscaling'))
  controllers.push(editorFolder.add(editorConfig, 'editor.smoothDownscaling'))
  controllers.push(editorFolder.add(editorConfig, 'editor.displayWelcomeMessage'))
  controllers.push(editorFolder.add(editorConfig, 'editor.displayResizeMessage'))
  controllers.push(editorFolder.add(editorConfig, 'editor.transparent'))
  controllers.push(editorFolder.add(editorConfig, 'editor.zoom', [0.5, 1.0, 1.5, 2.0]))
  controllers.push(editorFolder.add(editorConfig, 'editor.pixelRatio', [1, 2, 4]))
  controllers.push(editorFolder.add(editorConfig, 'editor.renderMode', ['dynamic', 'export']))
  controllers.push(editorFolder.add(editorConfig, 'editor.photoroll'))
  // controllers.push(editorFolder.add(editorConfig, 'library', ['unsplash', 'example']))

  controllers.forEach(function (controller) {
    controller.onFinishChange(function () {
      window.pesdkRelaunch()
    })
  })

  var serialization = {
    mode: 'download',
    version: '3.0.0',
    includeImage: false,
    serverUrl: 'http://localhost:3000/render',
    handleData: function (data, version) {
      var json = JSON.stringify(data, true, 2)
      if (this.mode === 'log') {
        console.log(json)
      } else if (this.mode === 'alert') {
        window.alert(json)
      } else if (this.mode === 'download') {
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(json)
        var link = document.createElement('a')
        link.setAttribute('href', dataStr)
        link.setAttribute('download', 'serialization-' + version + '.json')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else if (this.mode === 'server') {
        console.log('Not implemented yet!')
      }
    },
    serialize: function () {
      var self = this
      window.editor.serialize({ image: self.includeImage }, self.version)
        .then(function (data) {
          self.handleData(data, self.version)
        })
    },
    deserialize: function () {
      var fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.addEventListener('change', function () {
        if (!fileInput.files.length) return
        var file = fileInput.files[0]
        var reader = new window.FileReader()
        reader.onload = (function () {
          return function (e) {
            var data = e.target.result
            window.editor.deserialize(JSON.parse(data))
          }
        })(file)
        reader.readAsText(file)
      })
      fileInput.click()
    }
  }

  var serializationFolder = gui.addFolder('Serialization')
  serializationFolder.add(serialization, 'mode', ['download', 'log', 'alert', 'server'])
  serializationFolder.add(serialization, 'version', ['2.0.0', '3.0.0'])
  serializationFolder.add(serialization, 'includeImage')
  // serializationFolder.add(serialization, 'serverUrl')
  serializationFolder.add(serialization, 'serialize').name('Serialize')
  serializationFolder.add(serialization, 'deserialize').name('Deserialize')

  uiFolder.open()
  sdkFolder.open()
  editorFolder.open()
})
