const indexView = async (req,res) => {
   return await res.render('index');
}


const aboutView = async (req,res) => {
    return await res.render('about');
}

module.exports = {indexView, aboutView}