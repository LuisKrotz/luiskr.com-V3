
Install gsutil

-----

gsutil -h "Cache-Control:public,max-age=31536000" cp  -r {folder}  gs://{bucket}/{public_path}

----

set cache to 1Y - copy recusively and sent to the indicated path (must specify the /public)