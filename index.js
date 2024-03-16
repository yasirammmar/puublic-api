import express, { response } from 'express';
import axios from 'axios';

import bodyparser from 'body-parser'
import js2xmlparser from 'js2xmlparser'; 
import jsyaml from 'js-yaml'; 

 const app=express();
 const port=3000;
 app.use(bodyparser.urlencoded({urlencoded:true}));
 
 app.get("/",(req,res)=>{
    res.render("index.ejs",{joke:null})
 });
 app.post("/jokes",async(req,res)=>{
    try{
        const category = req.body.category;
       
        let flags=req.body.BlackListFlag;
      
        const type=req.body.TypeSelect;
    
        let lang=req.body.Language;
       
        let responsFormat=req.body.responseFormat;
        const minId = req.body.minId;
        const maxId = req.body.maxId;
        const amountJoke=req.body.amount;
        

        
        // if (!category || category.trim() === '') {
        //     throw new Error('Invalid category selected');
        // }

        // let apiUrl = 'https://v2.jokeapi.dev/joke/';
        // if (category === 'Any') {
        //     apiUrl += 'Any';
        // } else {
        //     const customCategory = req.body.customCategorySelect;
        //     if (!customCategory || customCategory.trim() === '') {
        //         throw new Error('Custom category not provided');
        //     }
        //     apiUrl += customCategory;
        // }
        let apiUrl = 'https://v2.jokeapi.dev/joke/';
       if (!category || category.trim() === '') {
           throw new Error('Invalid category selected');
        }
        console.log("beforeany")
        if (category === "Any") {
            console.log("any")
            apiUrl += 'Any';
            console.log(apiUrl)
          } 

        else {
            console.log("afterany")
            const customCategory = req.body.customCategorySelect;
            if (!customCategory || customCategory.trim() === '') {
                    throw new Error('Custom category not provided');
            }
            apiUrl += customCategory;
            console.log(apiUrl)
        }
        let queryParams = '';
        if (lang && lang.length > 0) {
            //flags is converted to an array if it's not already one
             // checkboxes might return either a single value or an array of values
            lang = Array.isArray(lang) ? lang: [lang];
           
            queryParams += `?lang=${lang.join(',')}`;
        }
        // if (flags && flags.length > 0) {
        //     //flags is converted to an array if it's not already one
        //      // checkboxes might return either a single value or an array of values
        //     flags = Array.isArray(flags) ? flags : [flags];
           
        //     queryParams += `?blacklistFlags=${flags.join(',')}`;
        // }
        if(flags){
            //if(queryParams.length>0)
            //{
                flags = Array.isArray(flags) ? flags : [flags];
                queryParams +=`${queryParams ? '&' : '?'}blacklistFlags=${flags}`;
                //`${queryParams ? '&' : '?'}blacklistFlags=${flags.join(',')}`;
            // }else{
            //     flags = Array.isArray(flags) ? flags : [flags];
            //     queryParams += `?blacklistFlags=${flags}`;
            // }
        }
        if(responsFormat){
            // if(queryParams.length>0)
            // {
                //respo = Array.isArray(respo) ? respo : [respo];
                queryParams += `${queryParams ? '&' : '?'}format=${responsFormat}`
            // }else{
            //     flags = Array.isArray(respo) ? respo : [respo];
            //     queryParams += `?format=${respo}`;
            // }
        }


        if (type) {
            //if (queryParams.length > 0) {
                queryParams +=`${queryParams ? '&' : '?'}type=${type}`;
            // } else {
            //     queryParams += `?type=${type}`;
            // }
        }
        if (minId && maxId) {
            queryParams += `${queryParams ? '&' : '?'}idRange=${minId}-${maxId}`;
        }
         if(amountJoke){
           queryParams += `${queryParams ? '&' : '?'}amount=${amountJoke}`;
        }
        console.log(apiUrl+queryParams)
        
        const response = await axios.get(apiUrl+queryParams);
        let result = response.data;
        if (!result || (Array.isArray(result) && result.length === 0)) {
            throw new Error('No jokes found with the provided parameters');
        }
        console.log(result)
        if(responsFormat==='xml'){
            result = js2xmlparser.parse("joke", result);
            console.log(result)
        }
        else if(responsFormat==='yaml')
        {
            
            result = jsyaml.dump(result);
              console.log(result)
        }else if(responsFormat==='plaintext')
        {
            if(result.type==="single")
            {
             result=result.joke
             console.log(result)
        //     // `${result.setup}\n${result.delivery}`
            }
            else (result.type==="twopart")
           {
              result= `${result.setup}\n${result.delivery}` ;
              console.log(result)
           }
        }
        // let joketext;
        // if(result.type==="single")
        // {
          
        //     joketext=result.joke
        //     // `${result.setup}\n${result.delivery}`
           
        // }
        // else if(result.type==="twopart")
        // {
        //   joketext= `${result.setup}\n${result.delivery}` ;
        // }
         
        // let jokes = Array.isArray(result.jokes) ? result.jokes : [result.jokes];
        //converting into the array
        // if (!Array.isArray(result)) {
        //     result = [result];
        // }
       // const jokes = Array.isArray(result) ? result : [result];
        console.log(result);
        const jokes = Array.isArray(result) ? result : [result];
        res.render("index.ejs", { joke: jokes, error: null });

                
        //res.render("index.ejs", { joke: jokes, error: null });
    }catch(error){
        console.error("Failed to make request:", error);
        // Render the index page with an error message
        res.render("index.ejs", { error: error.message })
    }
 })

 app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
 })