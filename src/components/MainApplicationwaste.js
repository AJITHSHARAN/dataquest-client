import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Input from '@material-ui/core/Input';
import { Button, OutlinedInput, TableCell, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import BlurLinearOutlinedIcon from '@material-ui/icons/BlurLinearOutlined';
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Checkbox from '@material-ui/core/Checkbox';
var fileDownload = require('js-file-download');


export default function MainApplication() {

  const initialState={
    filename:"",
	  status:"",
	  Checked:false,
	  keyWord:"",
	  linesToBeCopied:""
	
  }
   const [directoryList,setDirectoryList] = useState([])
   const [directoryName, setDirectoryName] = useState("")
   const [keyWord, setkeyword] = useState("")
   const [defLines, setDefLines] = useState("")
   const[files,setFiles]=useState([])
   
   
   useEffect(() => {
     console.log("hi")
     console.log(directoryList)
    }, [directoryList]);


    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
      }

      const fileChangeHandler = (e) =>
      {
        const files=[]
        console.log("hiiiii")
        for(let i = 0; i< e.target.files.length; i++) {
          files.push(e.target.files[i])
      }
      console.log(files)
      setFiles(files)
    }
      const uploadClickHandler=()=>
      {
       
        const formData = new FormData();
       
        for(let i = 0; i< files.length; i++) {
          formData.append('file', files[i])
        }
      formData.append('name','ajithkumar')
        axios.post('http://ec2-3-142-199-104.us-east-2.compute.amazonaws.com:8080/hello/',formData,{
          headers: {
            "Content-Type":"multipart/form-data"
          }
        })
        .then(response => {
          var str = JSON.stringify(response.data)
          console.log(str)
          var list = JSON.parse(str)
          setDirectoryList(list)
          
          
        }).catch(error =>
          {
            console.log(error.message)
          });
      }

      const applyForCheckHandler = () =>
      {
        var list = directoryList
        list.map((dir,i) => (
          dir.keyWord=keyWord,
          dir.linesToBeCopied=defLines
        ))
        console.log(list)
        setDirectoryList([...list])
        
      }

      const checkBoxHandler = (filename) =>
      {
        console.log("hi")
        var list1 = directoryList
        list1.map((dir,i) => {
          if(i==filename)
          {
          if(dir.checked==true)
           dir.checked=false
          else
           dir.checked=true 
        }})
        console.log(list1)
        setDirectoryList([...list1])
      }

      const findButtonHandler = () =>
      {
        
        const formData = new FormData()
        var str = JSON.stringify(directoryList)
        var list = JSON.parse(str);
        var list1 = directoryList
        var filename=""
        console.log(directoryList.length)
        list1.map((dir,i) => {
          console.log(dir.filename+dir.checked)
          if(dir.checked==true)
            filename = filename + dir.filename + ","
        })
        var lines = defLines
        var keyword = keyWord

        for(let i = 0; i< files.length; i++) {
          formData.append('file', files[i])
        }
        formData.append("lines",lines)
        formData.append("keyword",keyword)
        formData.append("filenames",filename)
        
        console.log(lines)
        console.log(keyWord)
        console.log(filename)

        axios.post('http://ec2-3-142-199-104.us-east-2.compute.amazonaws.com:8080/find', formData,{
          headers:{
          "Content-Type":"multipart/form-data"
         } })
        .then((response) => {
          var str = JSON.stringify(response.data)
          console.log(str)
          var list = JSON.parse(str);
          console.log(list)
          setDirectoryList(list)
          console.log(directoryList.length)
        }).catch(error =>
          {
            console.log(error.message)
          });
      }

      const saveHandler = () => {
        const formData = new FormData()
        var str = JSON.stringify(directoryList)
        var list = JSON.parse(str);
        var list1 = directoryList
        var filename=""
        console.log(directoryList.length)
        list1.map((dir,i) => {
          console.log(dir.filename+dir.checked)
          if(dir.checked==true && dir.status=='Found')
            filename = filename + dir.filename + ","
        })
        var lines = defLines
        var keyword = keyWord

        for(let i = 0; i< files.length; i++) {
          formData.append('file', files[i])
        }
        formData.append("lines",lines)
        formData.append("keyword",keyword)
        formData.append("filenames",filename)
        
        console.log(lines)
        console.log(keyWord)
        console.log(filename)

        axios.post('http://ec2-3-142-199-104.us-east-2.compute.amazonaws.com:8080/save', formData,{
          headers:{
          "Content-Type":"multipart/form-data"
         } })
        .then((response) => {
          fileDownload(response.data,'output.txt')
         
        }).catch(error =>
          {
            console.log(error.message)
          });
      }
    return (
        <>
        <HeadingComponent>
            <h1> <BlurLinearOutlinedIcon></BlurLinearOutlinedIcon></h1>
            <h3 style={{paddingLeft:10}}>Data Quest</h3>
        </HeadingComponent>
        <FirstComponent>
          <SearchDirComponent>
        Select Filesto Upload : <input type='file' name="files" id="inputfile" onChange={fileChangeHandler} multiple></input>
        </SearchDirComponent>
       <FirstButtonComponent>
       <Button
        variant="contained"
        color="default"
        startIcon={<CloudUploadIcon />}
        onClick={uploadClickHandler}
      >
        Upload
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
      >
        Close
      </Button>
       </FirstButtonComponent>
         
        </FirstComponent>
        <SecondComponent>
          <SecondInputComponent>
        <div> Search Keyword :  <OutlinedInput type='text' name="directoryname"  value={keyWord} onChange={(e)=> setkeyword(e.target.value)}style = {{width: 100,height:30,paddingLeft:10}}></OutlinedInput></div>
        <div style={{paddingLeft:210}}> Default Lines <OutlinedInput type='text' name="defaultLines" value={defLines} onChange={(e)=> setDefLines(e.target.value)} style = {{width: 100,height:30,paddingLeft:10}}></OutlinedInput></div>
        <div style={{paddingLeft:100}}>
        <Button
        variant="contained"
        color="primary"
        onClick={applyForCheckHandler}
        style={{fontSize:14 ,width:220,height:27}}
      >
        Apply for checked
      </Button>
        </div>
        </SecondInputComponent>
        </SecondComponent>
       <TableComponent> 
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">&nbsp;&nbsp;Select Files</TableCell>
            <TableCell align="center">File Name</TableCell>
            <TableCell align="center">Search Keyword&nbsp;(g)</TableCell>
            <TableCell align="center">Lines to be copied&nbsp;(g)</TableCell>
            <TableCell align="center">Status&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {directoryList.length>0 && directoryList.map((directory,i) => (
            <TableRow key={directory.filename}>
              <TableCell component="th" scope="row" align="center">
               <Checkbox checked={directory.checked} onClick={() => checkBoxHandler(i)} name={directory.filename}></Checkbox></TableCell>
              <TableCell align="center">{directory.filename}</TableCell>
              <TableCell align="center">{directory.keyWord}</TableCell>
              <TableCell align="center">{directory.linesToBeCopied}</TableCell>
              <TableCell align="center">{directory.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </TableComponent>
        { directoryList.length >0 &&
        
        <ButtonComponent>
          <div>
        <Button variant="contained" color="secondary" onClick={findButtonHandler}>
        Find
        </Button></div>
        <div>
        <Button variant="contained" color="primary" style={{paddingLeft: 20}} onClick={saveHandler}>
        Save
       </Button></div>
        </ButtonComponent>} 
        </>
    )
}

const FirstComponent = styled.div`
display: flex;
flex: 1;
padding-top : 40px;
justify-content: space-between;
align-items:center;
`;

const SecondComponent = styled.div`
display: flex;
flex: 1;
padding-top: 40px;
justify-content: space-between;
align-items: center;
>Button{
   font-size: 14px;
      width: 240px;
     height: 27px;
     margin:3px;
}
`;
const ButtonComponent = styled.div`
display: flex;
padding-left: 68%;
padding-top: 60px;
align-items:center;
>div{
  padding-left: 20px;
align-items:center;
}
`;
const TableComponent = styled.div`
display: flex;
margin-left:13%;
margin-right:19%;
padding-top: 60px;
>TableContainer{
    overflow-y : auto;
}
>Table{
    min-width: 500px;
    min-height:400px;
}
`;

const HeadingComponent =styled.div`
 display: flex;
 height: 70px;
 width: 100%;
 background-color:black;
 color: white;
 align-items: center;
     justify-content: center;
 `;

 const FirstButtonComponent = styled.div`
 padding-left: 10px;
 margin-right: 15%;
 >Button
 {
  font-size: 14px;
     width: 140px;
    height: 27px;
     margin:3px;
    
 }
 `;

 const SearchDirComponent = styled.div`
 padding-left:200px;
`;

const ApplyButtonComponent = styled.div`
display: flex;
margin-right:10%
>Button{
   font-size: 12px;
      width: 240px;
     height: 30px;
     margin:3px;
}
`;
const SecondInputComponent = styled.div`
padding-left:200px;
display: flex;
>Button{
   font-size: 12px;
      width: 240px;
     height: 20px;
     margin:3px;
}
`;