# runs all test files
export NODE_ENV=testing
export LOG_LEVEL=silent

rm /tmp/as-hot-storage*

run() {
  jsfilename=$(basename $0)
  directory_name=$(dirname "$0")
  temp_out_file="/tmp/as-hot-storage-$jsfilename.out"
  temp_err_file="/tmp/as-hot-storage-$jsfilename.err"
  echo "" > $temp_out_file
  echo "" > $temp_err_file

  printf "\e[0;33mRunning\e[0m tests/$jsfilename\n"
  test_result=$(node --test $0 | node parse-tap.mjs 2>&1)
  if echo "$test_result" | grep -q "^test failed"
  then
    echo "\e[0;31m(File)\e[0m: tests/$jsfilename" >> "$temp_err_file"
    echo "$test_result" >> "$temp_err_file"
    echo "" >> "$temp_err_file"
    printf "\e[0;31mFailed\e[0m tests/$jsfilename\n"
  else
    echo "\e[0;33m(File)\e[0m: tests/$jsfilename" >> "$temp_out_file"
    echo "$test_result" >> "$temp_out_file"
    echo "" >> "$temp_out_file"
    printf "\e[0;33mPassed\e[0m tests/$jsfilename\n"
  fi
}

if [ -z $1 ]
then 
  export -f run
  find tests -maxdepth 10 -type f | xargs -P10 -I {} bash -c run {}
  test_result=$(cat /tmp/as-hot-storage-*.out)
  printf "$test_result"
  failed_result=$(cat /tmp/as-hot-storage-*.err)
  printf "$failed_result"
  echo ""

  if echo "$failed_result" | grep -q "^test failed"
  then
      exit 1
  fi
else
  jsfilename="$1"
  printf "\e[0;33mRunning\e[0m $jsfilename\n"
  node --test-reporter=tap --test "$jsfilename" | node parse-tap.mjs
  echo ""
fi