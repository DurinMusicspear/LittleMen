app_dir = /home/ubuntu/www/carcassone
temp_install_dir = ./tmp
deployment_hostname = int.app

install :
	mkdir -p ./tmp
	# Combine js and css files
	# cat ./app/board.js ./app/unit_slot.js ./app/ability_card.js ./app/client.js > ./tmp/client_combined.js
	# cat ./app/styles2.css > ./tmp/styles_combined.css
	# Minify js and css files
	# java -jar ./Tools/yuicompressor-2.4.7.jar ./tmp/client_combined.js -o ./app/client.min.js
	# java -jar ./Tools/yuicompressor-2.4.7.jar ./tmp/styles_combined.css -o ./app/styles.min.css
	# Update references
	
	#Move new files to deployment directory
	sudo mkdir -p $(app_dir)
	sudo mkdir -p $(app_dir)/images
	sudo cp ./*.* $(app_dir)/
	sudo cp ./images/*.* $(app_dir)/images/
	# sudo cp ./node_arena_monit.conf /etc/monit/conf.d/
	# sudo cp ./node_arena.conf /etc/init/
	# Clean up temp directory
	rm -rf ./tmp

deploy :
	# Get rid of old temp installs
	# ssh $(deployment_hostname) sudo rm -rf $(temp_install_dir)
	# Copy files over to remote machine
	# rsync -r . $(deployment_hostname):$(temp_install_dir)
	# Install our app to the right location
	#ssh $(deployment_hostname) cd $(temp_install_dir)\;
	# -sudo stop --no-wait -q node_arena
	make install
	#ssh $(deployment_hostname) cd $(temp_install_dir)\;
	# make start_app

start_app :
	# sudo start --no-wait -q node_arena
	# sudo /etc/init.d/monit reload