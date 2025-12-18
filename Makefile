.PHONY: build build-force watch clean idempotency-test ci stats

build:
	@node build-idempotent.js

build-force:
	@node build-idempotent.js --force

watch:
	@node watch-build.js

clean:
	@rm -rf dist/ coverage/
	@echo "✅ Cleaned dist/ and coverage/"

idempotency-test:
	@echo "Testing build idempotency..."
	@npm run build
	@CHECKSUM1=$$(cat dist/.build-checksum); \
	npm run build; \
	CHECKSUM2=$$(cat dist/.build-checksum); \
	if [ "$$CHECKSUM1" = "$$CHECKSUM2" ]; then \
		echo "✅ Build is idempotent"; \
	else \
		echo "❌ Build is NOT idempotent"; \
		exit 1; \
	fi

ci: clean build lint test
	@echo "✅ All CI checks passed"

stats:
	@echo "Build Statistics:"
	@cat dist/build-manifest.json
