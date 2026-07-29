import { BadRequestException, Controller, Get, Param, Post,Res,UploadedFile,UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import type { Response,Express} from "express";

@Controller("api/uploads")
export class UploadsController {
    //Post api/uploads
    @Post()
    @UseInterceptors(FileInterceptor("file",{
        storage: diskStorage({
            destination: "./images",
            filename: (req,file,cb)=>{
                const prefix = `${Date.now()}-${Math.round(Math.random()*1e9)}`;
                const filename = `${prefix}-${file.originalname}`;
                cb(null,filename);
            }
        }),
        fileFilter: (req,file,cb)=>{
            if(file.mimetype.startsWith("image")){
                cb(null,true);
            }else{
                cb(new BadRequestException("Only image files are allowed"),false);
            }
        },
        limits: {
            fileSize: 2 * 1024 * 1024, // 2MB
        },

    }))
    public uploadFile(@UploadedFile() file: Express.Multer.File){
        if(!file) throw new BadRequestException("File is required");
        console.log("Uploaded file:", file);
        return { message: "File uploaded successfully", filename: file.filename };
    }

    //Get api/uploads
    @Get(":image")
    public getUploadedFiles(@Param("image") image: string, @Res() res: Response){
        return res.sendFile(image, { root: "./images" });
    }
}

