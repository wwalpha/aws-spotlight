# dev
if [$GITHUB_EVENT_NAME = 'push']; then
  export TEST=${{ needs.setup_dev.outputs.TEST }}
fi

# prod
if [$GITHUB_EVENT_NAME = 'release']; then
  export TEST=${{ needs.setup_dev.outputs.TEST }}
fi