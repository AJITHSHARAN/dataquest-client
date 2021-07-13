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
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import Paper from "@material-ui/core/Paper";
import BlurLinearOutlinedIcon from '@material-ui/icons/BlurLinearOutlined';
import Alert from '@material-ui/lab/Alert';
import ErrorIcon from '@material-ui/icons/Error';
import axios from "axios";
import Checkbox from '@material-ui/core/Checkbox';
var fileDownload = require('js-file-download');



export default function MainApplication() {


   const [directoryList,setDirectoryList] = useState([])
   const [keyWord, setkeyword] = useState("")
   const [defLines, setDefLines] = useState("")
   const[files,setFiles]=useState([])
   const[finalStatus,setFinalStatus] =useState("")
   const [fileContents,setFileContents]=useState([])
   const[keyWordErr,setKeywordErr]=useState(false)
   const[fileUploadErr,setFileUploadErr]=useState(false)
   const[defLinesErr,setDefLinesErr]=useState(false)
   const[findAndSaveButDisplayFlag,setFindAndSaveButDisplayFlag] = useState(false)
   const[saveButtonDisplayFlag,setSaveButtonDisplayFlag] = useState(true)


   
   useEffect(() => {
     console.log("useEffect called")
    }, [directoryList,keyWordErr,fileUploadErr,defLinesErr,defLines,keyWord,files,findAndSaveButDisplayFlag,saveButtonDisplayFlag]);


      const callbackForStatus = (status) => {
        setFinalStatus(status)
      }
       
      const closeHandler = () =>
      {
        setDirectoryList([])
        setkeyword("")
        setDefLines("")
        setFileUploadErr(false)
        setKeywordErr(false)
        setDefLinesErr(false)
        setFindAndSaveButDisplayFlag(false)
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
        setFindAndSaveButDisplayFlag(false)
        var list=[];
        if(files.length>0){
        for(let i=0;i<files.length;i++ )
        {
          setFileUploadErr(false)
        var file = files[i];
        console.log(file.name)
        var obj = {
          filename: file.name,
          status:"",
          checked:true,
	        keyWord:"",
	        linesToBeCopied:""
        }
        list.push(obj);
      }
        setDirectoryList([...list])
        console.log(directoryList)
    }
    else{
      setFileUploadErr(true)
    }
  
      }

      const applyForCheckHandler = () =>
      {
        setSaveButtonDisplayFlag(true)
       if(keyWord.length>=4 && defLines!="" && !isNaN(defLines) && parseInt(defLines)<=10){
         console.log("coorect")
         setKeywordErr(false)
         setDefLinesErr(false)
        const list = [...directoryList]
        list.map((dir,i) => (
          dir.keyWord=keyWord,
          dir.linesToBeCopied=defLines
        ))
        console.log(list)
        setDirectoryList([...list])
        setFindAndSaveButDisplayFlag(true)
        
       }
       else{
        setFindAndSaveButDisplayFlag(false)
         console.log("Errorrrr")
         if(keyWord.length<4){
          console.log("keyword Errorrrr")
           setKeywordErr(true)}
         if(isNaN(defLines) || defLines=="" || parseInt(defLines)>10){
          console.log("lines Errorrrr")
         setDefLinesErr(true)}
       }
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


      function getFile(file) {
        return new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onload = function (e) {
            //lines=this.result.split('\n');
            resolve(this.result.split("\n"));
          };
          reader.onerror = function (e) {
            reject("Error reading file");
          };
          reader.readAsText(file);
        });
      }
    
      const findButtonHandler = () => {
        let fileCon=[]
        let list1 = [...directoryList];
        for (let i = 0; i < files.length; i++) {
          let status = "";
          var file = files[i]
          Promise.all(list1.map(async (dir, j) => {
            if (dir.filename == file.name && dir.checked) {
              var lines = await getFile(file);
              for (var line = 0; line < lines.length; line++) {
                console.log(lines[line]);
                if (lines[line].includes(dir.keyWord)) {
                  console.log("text found");
                  status = "Found";
                  dir.status = "Found";
                  break;
                } else {
                  status = "Not Found";
                  dir.status = status;
                }
              }
              console.log("status" +status)
              list1[j].status = status
              console.log("status" + status);
              setDirectoryList([...list1]);
            }
          }));
        }
        console.log("list is "+list1);
        setSaveButtonDisplayFlag(false)
      }

      const saveHandler = () => {
        
        /* eslint-disable no-unused-expressions */ 
        let value=""
        let list1 = directoryList;

          list1.map(async (dir, j) => {
            for (let i = 0; i < files.length; i++) {
              if(files[i].name==dir.filename)
                 var file = files[i]
            }
            if (dir.filename == file.name && dir.checked && dir.status=='Found') {
              var occurence = []
              var fileContents=[]   
              var lines = await getFile(file);
              for (var line = 0; line < lines.length; line++) {
                fileContents.push(lines[line])
                if (lines[line].includes(dir.keyWord)) {
                  occurence.push(line)
                } 
              }
              value = value + getLinesToBeAdd(dir.linesToBeCopied,fileContents,occurence,dir.filename)
              console.log(value)
              if(j==list1.length-1)
               fileDownload(value,'output.txt')
            }
          })
        
        console.log("save")
      }
     
      const getLinesToBeAdd = (linesToBeCopied,fileContents,occurence,filename) => {
           let finalStr = ""
           finalStr = finalStr + "---------------------------------------------------------------------------------------\n "
           finalStr = finalStr+ "FileName : "+ filename+"\n"
           finalStr = finalStr + "---------------------------------------------------------------------------------------\n\n "
           var num = parseInt(linesToBeCopied)
           console.log(occurence)
           console.log(fileContents)
           console.log(num)
		       var counter=1;
           console.log(occurence[0])
           for(let k=0;k<occurence.length;k++ )
           {
             let exactLine = occurence[k]
             console.log(occurence.indexOf(k))
            finalStr = finalStr+ "Occurence "+counter + ":";
            finalStr = finalStr+ "\n";
            finalStr = finalStr+ "-------------";
            finalStr = finalStr+ "\n";
           if(exactLine-num>0) {
            console.log("first 3 lines")
             for(let i = exactLine-num; i <= exactLine-1; i++)
             {
              console.log("first 3 lines")
              finalStr = finalStr + fileContents[i];
              finalStr = finalStr + "\n";
             }
           }
             else {
              console.log("first 3 lines 2nd")
              console.log(exactLine)
               for(let i =0; i <exactLine; i++) {
                 console.log("first 3 lines")
                finalStr = finalStr + fileContents[i];
                finalStr = finalStr + "\n";
                 
               }
             }
             finalStr = finalStr + "******"+"\n"+fileContents[exactLine]+"\n"+"*********"+"\n";
           
           if(exactLine != fileContents.length-1)
           {
           if((exactLine+1) + num < fileContents.length)
           {
             for(let i = 1;i<=num;i++)
             {
               finalStr = finalStr + fileContents[exactLine+i];
               finalStr = finalStr + "\n";
             }
           }
           else {
             for(let i =exactLine+1; i < fileContents.length; i++) {
               finalStr = finalStr + fileContents[i];
               finalStr = finalStr + "\n";
           }
           }
           
           }
           counter++;
           finalStr = finalStr+ "\n";
           }

           return finalStr
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
        onClick={closeHandler}
      >
        Close
      </Button>
       </FirstButtonComponent>
         
        </FirstComponent>
        <SecondComponent>
          <SecondInputComponent>
        <div> Search Keyword :  <OutlinedInput type='text' name="directoryname"   value={keyWord} onChange={(e)=> { setFindAndSaveButDisplayFlag(false) ;setkeyword(e.target.value)}}style = {{width: 100,height:30,paddingLeft:10}}></OutlinedInput></div>
        
        <div style={{paddingLeft:70}}> 
        Default Lines <OutlinedInput type='text' name="defaultLines" value={defLines} onChange={(e)=>{  setFindAndSaveButDisplayFlag(false); setDefLines(e.target.value)}} style = {{width: 100,height:30,paddingLeft:10}}></OutlinedInput>
        </div>
        </SecondInputComponent>
        <ApplyButtonComponent>
        <Button
        variant="contained"
        color="primary"
        onClick={applyForCheckHandler}
        style={{fontSize:14 ,width:220,height:27}}
        
      >
        Apply for checked
      </Button>
        </ApplyButtonComponent>
        

        </SecondComponent>
        
        { keyWordErr && 
        <ErrorMessages>
        
         <ErrorOutlineOutlinedIcon 
        style={{color: "#e53935", fontSize: 20} }></ErrorOutlineOutlinedIcon> 
        <p style={{ fontSize: 10, color: "#e53935", paddingLeft:5}} >Keyword must have more than four characters</p> </ErrorMessages> }

        { defLinesErr && 
        <ErrorMessages1>
       
        <ErrorOutlineOutlinedIcon 
        style={{color: "#e53935", fontSize: 20} }></ErrorOutlineOutlinedIcon>
        <p style={{ fontSize: 10, color: "#e53935", paddingLeft:5}} >Default Lines should be numerical and should be in 1 to 10</p>
        </ErrorMessages1> }

       { fileUploadErr &&
        <AlertBoxComponent>
        <Alert variant="standard"severity="error"  style={{minWidth:750}}>No file is selected for uploading</Alert>
        </AlertBoxComponent> }
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
        { findAndSaveButDisplayFlag &&
        
        <ButtonComponent>
          <div>
        <Button variant="contained" color="secondary" onClick={findButtonHandler}>
        Find
        </Button></div>
        <div>
        <Button disabled = {saveButtonDisplayFlag} variant="contained" color="primary" style={{paddingLeft: 20}} onClick={saveHandler}>
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
padding-top: 40px;
justify-content: space-between;
align-items: center;
flex: 1;
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
padding-top: 30px;
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
 display: flex;
 padding-left: 10px;
 margin-right: 25%;
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
 padding-left: 10px;
 margin-right: 28%;

`;
const SecondInputComponent = styled.div`
display: flex;
padding-left:200px;

`;
const AlertBoxComponent = styled.div`
 padding-left:200px;
 padding-top: 20px;
 margin-right:19%;
 >.Alert{
   width: 500px;
 }
`

const ErrorMessages = styled.div`
display: flex;
align-items: center;
padding-top:10px;
padding-left:200px;
`;
const ErrorMessages1 = styled.div`
display: flex;
align-items: center;
padding-top:1px;
padding-left:200px;
`;