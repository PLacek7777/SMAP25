import hashlib
import sys

if __name__ == "__main__":
    if len(sys.argv) < 2 | len(sys.argv) > 2:
        print(f"Need 1 argument, provided {len(sys.argv)-1}", file=sys.stderr)
        sys.exit()
    
    arg = sys.argv[1].encode()
    package = hashlib.sha256(arg).hexdigest()

    print(package)