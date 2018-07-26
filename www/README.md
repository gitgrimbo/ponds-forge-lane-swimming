A front end to the service API implemented with AWS lambda.

`npm run deploy` will deploy the front end to http://gitgrimbo.github.io/ponds-forge-lane-swimming.

# Possible Errors

```
fatal: HttpRequestException encountered.
   An error occurred while sending the request.
bash: /dev/tty: No such device or address
error: failed to execute prompt script (exit code 1)
fatal: could not read Username for 'https://github.com': No error
```

Make sure authentication is set up:

`git config --global credential.helper wincred`
