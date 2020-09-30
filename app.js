const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());
const courses = [
  { id: 1, name: "Computer Security" },
  { id: 2, name: "Automata Theory" },
  { id: 3, name: "software engineering" },
];
app.get("/", (req, res) => {
  res.send("Hello Amit!!!!");
});

app.get("/api/courses", (req, res) => {
  // res.send([1, 2, 3, 4, 5]);
  res.send(courses);
});

// app.get("/api/courses/:id", (req, res) => {
//   res.send(req.params.id);
// });
// app.get("/api/posts/:year/:months", (req, res) => {
//   res.send(req.params);
// });
app.get("/api/posts/:year/:months", (req, res) => {
  res.send(req.query);
});
/* handing get request using given ID */
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the give ID was not found!");
  res.send(course);
});

/* Handling Post request */
app.post("/api/courses", (req, res) => {
  /*const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);
  // console.log(result);
  if (result.error) {
    // 400 Bad request
    res.status(400).send(result.error.details[0].message);
    return;
  }*/
  const { error } = validateCourses(req.body); // by object destructing
  //if invalidate, return 400 -- Bad request
  if (error)
    // 400 Bad request
    return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});
/* handing put request*/
app.put("/api/courses/:id", (req, res) => {
  // look up the course
  // if not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the give ID was not found!");
  //validate
  // const result = validateCourses(req.body);
  const { error } = validateCourses(req.body); // by object destructing
  //if invalidate, return 400 -- Bad request
  if (error)
    // 400 Bad request
    return res.status(400).send(error.details[0].message);
  // update course
  course.name = req.body.name;
  //Return the updated course
  res.send(course);
});

/* Validate function for courses */
function validateCourses(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

/* handling delete request */
app.delete("/api/courses/:id", (req, res) => {
  // look up the course
  // if not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the give ID was not found!");

  // delete the course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
