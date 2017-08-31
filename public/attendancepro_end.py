# this is old seles script, works as expected
import sys
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.support import ui
from selenium.webdriver.common.keys import Keys
import time
from ctypes import *

username = sys.argv[1]
password = sys.argv[2]


def page_is_loaded(driver):
    return driver.find_element_by_tag_name("body") != None


#driver = webdriver.Chrome("./chromedriver.exe")
#driver = webdriver.PhantomJS(service_log_path=os.path.devnull)
driver = webdriver.PhantomJS(executable_path='public/phantomjs')
driver.get("https://attendance.cvi.co.jp/LogOn.aspx")
wait = ui.WebDriverWait(driver, 10)
wait.until(page_is_loaded)

email_field = driver.find_element_by_xpath("//*[@id=\"txtUserID\"]")
email_field.send_keys(username)

company_field = driver.find_element_by_xpath("//*[@id=\"txtCompanyCode\"]")
company_field.send_keys("emc")

password_field = driver.find_element_by_xpath("//*[@id=\"txtPassword\"]")
password_field.send_keys(password)
password_field.send_keys(Keys.RETURN)
wait = ui.WebDriverWait(driver, 10)
wait.until(page_is_loaded)
time.sleep(5)

if driver.find_element_by_xpath("//*[@id=\"ctl00_ContentMain_btnWebEndTime\"]").is_enabled():
    driver.find_element_by_xpath(
        "//*[@id=\"ctl00_ContentMain_btnWebEndTime\"]").click()  # Send day end
    print "sent the message to AttendancePro"
##    user32.MessageBoxA(
##        0,
##        "End done",
##        "AttendancePro",
##        0)
else:
    print "can not sent message because the button is disabled"
##    user32.MessageBoxA(
##        0,
##        "End already done",
##        "AttendancePro",
##        0)
##
##if driver.find_element_by_xpath("//*[@id=\"ctl00_ContentMain_btnWebStartTime\"]").is_enabled():
##    user32.MessageBoxA(
##        0,
##        "Start seems not to be done. Please do it manually",
##        "AttendancePro",
##        0)

driver.close()
driver.quit()
##os.system('taskkill /fi "WindowTitle eq attendancepro_end"')
##sys.exit()
