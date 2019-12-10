import config from '../config'

export default err => {
    if (config.env && config.env === 'dev') {
        console.log(err)
    }
}
