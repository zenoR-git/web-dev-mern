import React,{ useState } from 'react'
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './SignUP.css'
import botimg from '../assets/profile_pic.jpg'
import {useSignupUserMutation} from '../services/appApi'




function SignUP() {

  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const [signupUser,{isLoading,error}] = useSignupUserMutation()

   //img state
  const [img,setImg] = useState(null)   
  const [uploadImg, setUploadImg] = useState(false)
  const [imgPreview, setImgPreview]= useState(null)
  
  function validateImage(e){
    const file = e.target.files[0];
    if (file.size >= 1048576){
       return alert("max size is 1 MB");
    }else{
     setImg(file)
     setImgPreview(URL.createObjectURL(file))
    }
  }

  async function uploadImage(){
    const data = new FormData()
    data.append('file', img)
    data.append('upload_preset','chat-app_pic')
    try{
      setUploadImg(true)
      let res = await  fetch("{/* url where u are going to upload images like Clouifare*/}",{
        method: 'post',
        body:data,
      })
      const urlData = await res.json()
      setUploadImg(false)
      return urlData.url
    }catch(error){
      setUploadImg(false)
      console.log(error)
    }
  }

  async function handleSignup(e){
    e.preventDefault()
    if (!img){
      return alert("please upload your profile picture")
    }
    const url = await uploadImage(img)
    console.log(url)
    //signup the user
    signupUser({name,email, password, picture: url}).then(({data})=>{
      if (data){
        console.log(data)
        navigate('/chat')
      }
    })
  }

  return (
    <Container>
    <Row>
      <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
    <Form style={{width:"80%", maxWidth: 500}} onSubmit={handleSignup}>
    <h1 className="text-center">Create Account</h1>
    <div className='signup-profile-pic_container'>
      <img src={ imgPreview || botimg  } className='signup-profile-pic' />
      <label htmlFor='image-upload' className='image-upload-label'><i className='fas fa-plus-circle add-picture-icon'></i>
      </label>
      <input type="file" id="image-upload" hidden accept="image/png, image/jpeg, image/jpg" onChange={validateImage}></input>
    </div>
    {error && <p className='alert alert-danger'>{error.data}</p>}

    {/*name start*/}
    <Form.Group className="mb-3" controlId="formBasicName">
      <Form.Label>Name</Form.Label>
      <Form.Control type="text" placeholder="your Name" onChange={e=>setName(e.target.value)} value={name}/>
    </Form.Group>
    
    {/*email start*/}
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" onChange={e=>setEmail(e.target.value)} value={email}/>
      <Form.Text className="text-muted">
        We'll never share your email with anyone else.
      </Form.Text>
    </Form.Group>
  
    {/*password start*/}     
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} value={password}/>
    </Form.Group>

    <Button variant="primary" type="submit">
      {uploadImg|| isLoading? 'Signing you up...': 'Sign up'}
    </Button>
    <div className="py-4">
      <p className="text-center">
       Already have an account? 
        <Link to="/signup">Login</Link> 
      </p>
    </div>

  </Form>
  </Col>
  <Col md={5} className="signup__bg"> </Col>
  </Row>
  </Container>
  )
}

export default SignUP