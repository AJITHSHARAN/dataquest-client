import React from 'react'
import styled from 'styled-components';

export default function InputText(props) {

    const {labelname,name,placeholder} = props
    return (
        <InputContainer>
            {labelname}  <input  name={name} placeholder={placeholder} varient="outlined"></input>
        </InputContainer>
    )
}

const InputContainer = styled.div`
    display:flex;
    padding-top:20px;
 >input{
    width: 400px;
    border : 1px solid grey;
    border-radius : 3px;
    padding:5px;
    outline: none;
    height:25px;
}
`;