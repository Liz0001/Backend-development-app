

function authorizeUser(req, res, next) {
  if (req.user == null) {
    res.status(403).render("identify.ejs")
  }

}



const authorizeAdmin = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  next();
};

const authorizeTeacher = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'teacher') {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  next();
};


const authorizeStudent = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== 'student') {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  next();
};

module.exports = { authorizeUser, authorizeAdmin, authorizeTeacher, authorizeStudent }
