const storage = weex.requireModule('storage')
import { isJson } from './utils'

export function saveData (name, result) {
    // const key = storageKeys[name]
    // if (!key) return
    if (!name) return
    console.log("savedata")
    if (result && typeof result === 'object') {
        console.log(Date.now())
      if (WXEnvironment.platform === 'Web') {
        console.log(result)
        result.timestamp = Date.now()
        storage.setItem(name, JSON.stringify(result), event => {
            console.log(event)
            console.log('set success')
          })
      } else {
        // 通过module存到app内SharedPreferences
        const util = weex.requireModule('DefaultPreferenceModule')
        util.saveData(name, JSON.stringify(result))
      }
    }
  }
  export function readData (name, done = () => {}, fail = () => {}) {
    // const key = storageKeys[name]
    // if (!key) return fail()
    if (!name) return fail()
    try {
      if (WXEnvironment.platform === 'Web') {
        storage.getItem(name, event => {
          if (event.result === 'success') {
            const result = JSON.parse(event.data)
            return done(result)
          }
          fail(event)
        })
      } else {
        // 通过module读取app内SharedPreferences
        const util = weex.requireModule('DefaultPreferenceModule')
        util.readData(name, res => {
          if (isJson(res)) {
            const result = JSON.parse(res)
            return done(result)
          } else {
            fail("json parse error")
          }
        })
      }
    } catch (e) {
      fail(e)
    }
  }
  export function saveString (name, result) {
    // const key = storageKeys[name]
    // if (!key) return
    if (!name) return
    console.log("savestring")
    if (result && typeof result === 'string') {
      if (WXEnvironment.platform === 'Web') {
        console.log(result)
        storage.setItem(name, result, event => {
            console.log(event)
            console.log('set success')
          })
      } else {
        // 通过module存到app内SharedPreferences
        const util = weex.requireModule('DefaultPreferenceModule')
        util.saveData(name, result)
      }
    }
  }
  export function readString (name, done = () => {}, fail = () => {}) {
    // const key = storageKeys[name]
    // if (!key) return fail()
    if (!name) return fail()
    try {
      if (WXEnvironment.platform === 'Web') {
        storage.getItem(name, event => {
          if (event.result === 'success') {
            return done(event.data)
          }
          fail(event)
        })
      } else {
        // 通过module读取app内SharedPreferences
        const util = weex.requireModule('DefaultPreferenceModule')
        util.readData(name, res => {
            return done(res)
        })
      }
    } catch (e) {
      fail(e)
    }
  }