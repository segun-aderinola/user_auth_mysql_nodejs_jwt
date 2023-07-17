const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conn = require("../middleware/databaseConnector");
const dotenv = require('dotenv');
dotenv.config();
const signup = async (req, res) => {
  var { firstName, lastName, userName, password } = req.body;
try {
    if (
        firstName == undefined ||
        lastName == undefined ||
        userName == undefined ||
        password == undefined
      ) {
        return res.status(422).json({
          success: false,
          message: "All data are required! Please",
        });
      } else {
        // check if user exists already
        const user = conn.query(
          "SELECT * FROM users WHERE `username`= '" + userName + "'",
          async (err, data) => {
            if (err) {
              console.error("An error occurred:", err.message);
              res
                .status(500)
                .json({
                  status: 500,
                  message: "An error occurred: " + err.message,
                });
            }
            if (data.length == 0) {
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(password, salt);
              password = hashPassword;
    
              const queryString =
                "INSERT INTO users (firstName, lastName, username, password) VALUES(?,?,?,?)";
    
              const createUser = conn.query(
                queryString,
                [firstName, lastName, userName, password],
                (err, data) => {
                  if (err) {
                    console.error("An error occurred:", err.message);
                    res
                      .status(500)
                      .json({
                        status: 500,
                        message: "An error occurred: " + err.message,
                      });
                  }
                  
                  res.status(200).json({
                    success: true,
                    message: "User created successfully",
                    result: data,
                  });
                }
              );
            } else {
              res.status(404).json({
                success: false,
                message: "User already exists",
              });
            }
          }
        );
      }
} catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Signup failed',
        error: error
    })
}
  
};

const login = async (req, res) => {
  const {userName, password} = req.body;
  
try {
    if(userName == undefined || password == undefined) {
        return res.status(422).json({
            success: false,
            message: "All data are required! Please",
          });
    }
    const checkUser = conn.query("SELECT * FROM users WHERE username ='"+userName +"'", async(err, user)=>{
        if(err){
            console.error("An error occurred:", err.message);
            res
                .status(500)
                .json({
                status: 500,
                message: "An error occurred: " + err.message,
                });
        }
        // console.log(user.length);

        if(user.length > 0){
            // check password
            // console.log(password, user[0].password);
          const isPasswordValid = bcrypt.compare(password, user[0].password);
          
            if(!isPasswordValid){
                return res.status(401).json({
                    success: false,
                    message:"Invalid Password"
                }) 
            }
    
             // Generate jwt token
             const token = jwt.sign({userToken: user[0].id}, process.env.JWT_SECRET_KEY, {
                expiresIn: '1hr' // expires in 1hr
            })
    
            if(token){
                return res.status(200).json({
                    message: 'Login successful',
                    token,
                })
            }
        }
        else{
            return res.status(404).json({
                success: false,
                message: 'User not found',
                
            })
        }
      }) 
} catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error
    })
}
  
};
const updateUser = async (req, res) => {
    var { firstName, lastName } = req.body;
    var id = req.params.id;
    try {
        if (
            firstName == undefined ||
            lastName == undefined 
          ) {
            return res.status(422).json({
              success: false,
              message: "All data are required! Please",
            });
          } else {
            // check if user exists already
            const user = conn.query(
              "SELECT * FROM users WHERE `id`= '" + id + "'",
              async (err, data) => {
                if (err) {
                  console.error("An error occurred:", err.message);
                  res
                    .status(500)
                    .json({
                      status: 500,
                      message: "An error occurred: " + err.message,
                    });
                }
                if (data.length > 0) {
                  
        
                  const queryString =
                    "UPDATE users SET firstName = ? , lastName = ? WHERE id='"+id+"'";
        
                  const updateUser = conn.query(
                    queryString,
                    [firstName, lastName],
                    (err, data) => {
                      if (err) {
                        console.error("An error occurred:", err.message);
                        res
                          .status(500)
                          .json({
                            status: 500,
                            message: "An error occurred: " + err.message,
                          });
                      }
                      
                      res.status(200).json({
                        success: true,
                        message: "User updated successfully",
                        result: data,
                      });
                    }
                  );
                } else {
                  res.status(404).json({
                    success: false,
                    message: "User not found",
                  });
                }
              }
            );
          }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Update failed',
            error: error
        })
    }
};
const getUser = async (req, res) => {
    try {
        const queryString = "SELECT * FROM users";
        const getUser = conn.query(queryString, (err, user) => {
          if (err) {
            console.error("An error occurred:", err.message);
            res
              .status(500)
              .json({ status: 500, message: "An error occurred: " + err.message });
          }
      
          res
            .status(200)
            .json({ success: true, message: "Data fetched", result: user });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Operation failed',
            error: error
        })
    }

};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const queryString = "DELETE FROM users WHERE id = " + id;
    const deleteRequest = conn.query(queryString, (err, result) => {
        if(err){
            console.error("An error occurred:", err.message);
            res
              .status(500)
              .json({ status: 500, message: "An error occurred: " + err.message });
        }
        res
            .status(200)
            .json({ success: true, message: "User deleted"});
        
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Operation failed',
        error: error
    })
  }
};

module.exports = { signup, login, updateUser, getUser, deleteUser };
